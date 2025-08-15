from flask import Flask, request, jsonify, redirect, url_for, session
from flask_cors import CORS
import os, secrets, requests
import base64
from config import *
from llm_workflow import run_workflow
import hashlib, base64

# Initialize Flask app
app = Flask(__name__)
# Enable CORS for all routes
CORS(app, supports_credentials=True)

# Set a secret key for session management
# os.urandom(24) generates a random key for session security
app.secret_key = os.urandom(24)

# Store user tokens (in production, use a proper database)
user_tokens = {}

@app.route('/')
def landing_page():
    """Landing page - redirect to React frontend"""
    return redirect("http://localhost:5173")

@app.route('/check-auth', methods=['GET'])
def check_auth():
    """Check if user is authenticated"""
    try:
        user_id = session.get('user_id')
        if user_id and user_id in user_tokens:
            # Verify token is still valid by making a test API call
            access_token = user_tokens[user_id]["access_token"]
            headers = {"Authorization": f"Bearer {access_token}"}
            
            # Test token with Twitter API
            response = requests.get("https://api.twitter.com/2/users/me", headers=headers)
            
            if response.status_code == 200:
                user_data = response.json()
                return jsonify({
                    "authenticated": True,
                    "user": {
                        "id": user_data["data"]["id"],
                        "username": user_data["data"]["username"],
                        "name": user_data["data"]["name"],
                        "profile_image_url": "👤",  # You can get real profile image from API
                        "verified": user_data["data"].get("verified", False)
                    }
                })
            else:
                # Token expired or invalid
                if user_id in user_tokens:
                    del user_tokens[user_id]
                session.clear()
                
        return jsonify({"authenticated": False})
    
    except Exception as e:
        print(f"Auth check error: {e}")
        return jsonify({"authenticated": False})

@app.route('/login')
def login():
    """Initiate X OAuth login"""
    try:
        state = secrets.token_urlsafe(16)
        session['state'] = state
        session['user_id'] = secrets.token_urlsafe(16)

        code_verifier = secrets.token_urlsafe(32)
        code_challenge = base64.urlsafe_b64encode(
            hashlib.sha256(code_verifier.encode()).digest()).decode().rstrip("=")

        session['code_verifier'] = code_verifier

        auth_url = f"{AUTH_URL}?response_type=code&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&scope=tweet.read%20tweet.write%20users.read%20offline.access&state={state}&code_challenge={code_challenge}&code_challenge_method=S256"
        return redirect(auth_url)
    
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"error": "Login initialization failed"}), 500

@app.route('/callback')
def callback():
    """Handle OAuth callback from X"""
    try:
        code = request.args.get('code')
        state = request.args.get('state')
        
        if not code or state != session.get('state'):
            return jsonify({"error": "Invalid state or missing code"}), 400

        token_data = {
            "grant_type": "authorization_code",
            "code": code,
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "redirect_uri": REDIRECT_URI,
            "code_verifier": session['code_verifier']
        }

        auth_header = base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()
        headers = {
            "Authorization": f"Basic {auth_header}",
            "Content-Type": "application/x-www-form-urlencoded"
        }

        r = requests.post(TOKEN_URL, data=token_data, headers=headers)
        if r.status_code != 200:
            print(f"Token request failed: {r.text}")
            return jsonify({"error": "Failed to get token"}), 500

        token_json = r.json()
        user_id = session['user_id']
        user_tokens[user_id] = {
            "access_token": token_json["access_token"],
            "refresh_token": token_json.get("refresh_token")
        }

        # Redirect back to React frontend instead of different URL
        return redirect("http://localhost:5173?auth=success")
    
    except Exception as e:
        print(f"Callback error: {e}")
        return redirect("http://localhost:5173?auth=error")

@app.route('/logout', methods=['GET'])
def logout():
    """Logout user and clear session"""
    try:
        user_id = session.get('user_id')
        if user_id and user_id in user_tokens:
            del user_tokens[user_id]
        
        session.clear()
        return jsonify({"success": True, "message": "Logged out successfully"})
    
    except Exception as e:
        print(f"Logout error: {e}")
        return jsonify({"error": "Logout failed"}), 500

@app.route('/generate-tweet', methods=['POST'])
def generate():
    """Generate AI tweet using LLM workflow"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
            
        topic = data.get("topic")
        if not topic:
            return jsonify({"error": "Missing topic"}), 400
            
        # Run your LLM workflow
        result = run_workflow(topic)
        
        # Ensure the result has the expected format for React frontend
        if isinstance(result, dict) and "success" not in result:
            result["success"] = True
            
        return jsonify(result)
    
    except Exception as e:
        print(f"Generate tweet error: {e}")
        return jsonify({
            "error": f"Tweet generation failed: {str(e)}",
            "success": False
        }), 500

@app.route('/post-tweet', methods=['POST'])
def post_tweet():
    """Post tweet to X platform"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
            
        tweet = data.get("tweet")
        if not tweet:
            return jsonify({"error": "Missing tweet content"}), 400
            
        if len(tweet) > 280:
            return jsonify({"error": "Tweet exceeds 280 character limit"}), 400
        
        # Get access token from session
        user_id = session.get('user_id')
        if not user_id or user_id not in user_tokens:
            return jsonify({"error": "User not authenticated"}), 401
            
        access_token = user_tokens[user_id]["access_token"]
        
        # Post to Twitter API
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(
            "https://api.twitter.com/2/tweets",
            headers=headers,
            json={"text": tweet}
        )
        
        if response.status_code == 201:
            tweet_data = response.json()
            tweet_id = tweet_data["data"]["id"]
            
            return jsonify({
                "success": True,
                "tweet_id": tweet_id,
                "url": f"https://twitter.com/user/status/{tweet_id}",
                "posted_at": tweet_data["data"].get("created_at"),
                "character_count": len(tweet)
            })
        else:
            print(f"Twitter API error: {response.text}")
            return jsonify({
                "error": f"Failed to post tweet: {response.text}",
                "success": False
            }), response.status_code
    
    except Exception as e:
        print(f"Post tweet error: {e}")
        return jsonify({
            "error": f"Failed to post tweet: {str(e)}",
            "success": False
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"}), 200

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True, port=5000, host='0.0.0.0')