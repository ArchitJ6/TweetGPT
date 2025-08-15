import React, { useState, useEffect } from "react";
import {
  Bot,
  Twitter,
  Zap,
  Shield,
  Smartphone,
  ArrowRight,
  LogIn,
  LogOut,
  Send,
  RefreshCw,
  Sparkles,
  User,
  Home,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { GeneratorPage, HomePage } from "./pages";
import { ApiService } from "./services";
import { NavigationBar, NotificationBar } from "./components";

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [topic, setTopic] = useState("");
  const [generatedTweet, setGeneratedTweet] = useState("");
  const [optimizationHistory, setOptimizationHistory] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [postedTweetUrl, setPostedTweetUrl] = useState("");

  // Check for OAuth callback success/error on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get("auth");

    if (authStatus === "success") {
      setSuccess("Successfully logged in with X!");
      setTimeout(() => setSuccess(""), 5000);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (authStatus === "error") {
      setError("Login failed. Please try again.");
      setTimeout(() => setError(""), 5000);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const authResult = await ApiService.checkAuth();
        if (authResult.authenticated) {
          setIsAuthenticated(true);
          setUser(authResult.user);
        }
      } catch (error) {
        console.error("Failed to check auth status:", error);
      }
    };

    initAuth();
  }, []);

  // Handle login
  const handleLogin = async () => {
    try {
      setError("");
      setAuthLoading(true);
      await ApiService.initiateLogin();
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(""), 5000);
      setAuthLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      setError("");
      await ApiService.logout();
      setIsAuthenticated(false);
      setUser(null);
      setGeneratedTweet("");
      setOptimizationHistory([]);
      setTopic("");
      setPostedTweetUrl("");
      setSuccess("Successfully logged out");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(""), 5000);
    }
  };

  // Handle tweet generation
  const handleGenerateTweet = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic for your tweet");
      setTimeout(() => setError(""), 5000);
      return;
    }

    try {
      setError("");
      setIsGenerating(true);
      setOptimizationHistory([]);
      setGeneratedTweet("");

      const result = await ApiService.generateTweet(topic);

      if (result.success) {
        setGeneratedTweet(result.tweet || result.final_tweet);

        // Handle optimization history from your LLM workflow
        if (result.tweet_history && result.feedback_history) {
          const mergedHistory = result.tweet_history.map((tweet, index) => ({
            tweet,
            feedback: result.feedback_history[index] || null,
          }));
          setOptimizationHistory(mergedHistory);
        }

        setSuccess("Tweet generated and optimized successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        throw new Error(result.error || "Unknown error occurred");
      }
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(""), 5000);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle tweet posting
  const handlePostTweet = async () => {
    if (!generatedTweet) {
      setError("No tweet to post");
      setTimeout(() => setError(""), 5000);
      return;
    }

    if (!isAuthenticated) {
      setError("Please login with X to post tweets");
      setTimeout(() => setError(""), 5000);
      return;
    }

    try {
      setError("");
      setIsPosting(true);

      const result = await ApiService.postTweet(generatedTweet);

      if (result.success) {
        setPostedTweetUrl(result.url);
        setSuccess("Tweet posted successfully! 🎉");
        setTimeout(() => setSuccess(""), 8000);
      } else {
        throw new Error(result.error || "Failed to post tweet");
      }
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(""), 5000);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <NavigationBar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isAuthenticated={isAuthenticated}
        user={user}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        authLoading={authLoading}
      />
      <NotificationBar error={error} success={success} />
      {currentPage === "home" && (
        <HomePage
          setCurrentPage={setCurrentPage}
          isAuthenticated={isAuthenticated}
          handleLogin={handleLogin}
          authLoading={authLoading}
        />
      )}
      {currentPage === "generator" && (
        <GeneratorPage
          topic={topic}
          setTopic={setTopic}
          generatedTweet={generatedTweet}
          isGenerating={isGenerating}
          handleGenerateTweet={handleGenerateTweet}
          isAuthenticated={isAuthenticated}
          handlePostTweet={handlePostTweet}
          isPosting={isPosting}
          postedTweetUrl={postedTweetUrl}
          optimizationHistory={optimizationHistory}
          success={success}
          setSuccess={setSuccess}
        />
      )}
    </div>
  );
};

export default App;
