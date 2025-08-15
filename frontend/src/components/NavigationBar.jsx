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

const NavigationBar = ({
    currentPage,
    setCurrentPage,
    isAuthenticated,
    user,
    handleLogin,
    handleLogout,
    authLoading
}) => (
  <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center space-x-2">
          <Bot className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">TweetGPT</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => setCurrentPage("home")}
            className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentPage === "home"
                ? "text-blue-600 bg-blue-50"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </button>
          <button
            onClick={() => setCurrentPage("generator")}
            className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentPage === "generator"
                ? "text-blue-600 bg-blue-50"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            <span>Generator</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">
                  {user?.profile_image_url || "👤"}
                </span>
                <div className="hidden sm:flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {user?.name || "User"}
                  </span>
                  <span className="text-xs text-gray-500">
                    @{user?.username || "username"}
                  </span>
                </div>
                {user?.verified && <span className="text-blue-500">✓</span>}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              disabled={authLoading}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {authLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Twitter className="h-4 w-4" />
                  <span>Login with X</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  </nav>
);

export default NavigationBar;
