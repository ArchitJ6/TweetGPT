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

const HomePage = ({
  setCurrentPage,
  isAuthenticated,
  handleLogin,
  authLoading,
}) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    {/* Hero Section */}
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
      <div className="text-center">
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-3 bg-white rounded-full px-6 py-3 shadow-lg">
            <Bot className="h-8 w-8 text-blue-600" />
            <Sparkles className="h-6 w-6 text-purple-500" />
            <Twitter className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          AI-Powered
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            {" "}
            Tweet{" "}
          </span>
          Generator
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Create engaging, humorous tweets with the power of AI. Our advanced
          LLM models generate and optimize content that resonates with your
          audience.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setCurrentPage("generator")}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <Zap className="h-5 w-5" />
            <span className="font-semibold">Start Generating</span>
            <ArrowRight className="h-5 w-5" />
          </button>

          {!isAuthenticated && (
            <button
              onClick={handleLogin}
              disabled={authLoading}
              className="flex items-center justify-center space-x-2 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-gray-400 disabled:opacity-50 transition-all"
            >
              {authLoading ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Twitter className="h-5 w-5" />
                  <span>Connect X Account</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>

    {/* Features Section */}
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Powerful Features
        </h2>
        <p className="text-lg text-gray-600">
          Everything you need to create amazing tweets
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
            <Bot className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            AI-Powered Generation
          </h3>
          <p className="text-gray-600">
            Uses advanced LLM models to generate humorous and engaging
            tweets
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
            <RefreshCw className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Iterative Optimization
          </h3>
          <p className="text-gray-600">
            Automatically improves tweets based on AI feedback and best
            practices
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
            <Shield className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Secure OAuth
          </h3>
          <p className="text-gray-600">
            Safe and secure X API integration with OAuth 2.0 authentication
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="bg-orange-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
            <Smartphone className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Mobile Friendly
          </h3>
          <p className="text-gray-600">
            Works seamlessly on desktop and mobile devices with responsive
            design
          </p>
        </div>
      </div>
    </div>

    {/* CTA Section */}
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Go Viral?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Join thousands of users creating engaging content with AI assistance
        </p>
        <button
          onClick={() => setCurrentPage("generator")}
          className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg"
        >
          Get Started Now
        </button>
      </div>
    </div>
  </div>
);

export default HomePage;
