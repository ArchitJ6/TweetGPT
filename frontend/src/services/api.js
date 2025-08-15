// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Real API service
const ApiService = {
  // GET /check-auth - Check authentication status
  checkAuth: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/check-auth`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Auth check failed:", error);
      return { authenticated: false };
    }
  },

  // GET /login - X OAuth login
  initiateLogin: async () => {
    try {
      // Redirect to Flask backend for OAuth flow
      window.location.href = `${API_BASE_URL}/login`;
    } catch (error) {
      throw new Error("Login initialization failed");
    }
  },

  // GET /logout - Logout user
  logout: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error("Logout failed");
    }
  },

  // POST /generate-tweet - Generate AI tweet
  generateTweet: async (topic) => {
    try {
      const response = await fetch(`${API_BASE_URL}/generate-tweet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Tweet generation failed: ${error.message}`);
    }
  },

  // POST /post-tweet - Post tweet to X
  postTweet: async (tweetContent) => {
    try {
      const response = await fetch(`${API_BASE_URL}/post-tweet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ tweet: tweetContent }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to post tweet: ${error.message}`);
    }
  },
};

export { ApiService };
