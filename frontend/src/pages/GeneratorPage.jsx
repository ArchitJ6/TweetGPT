import {
  Bot,
  Twitter,
  Zap,
  Shield,
  Smartphone,
  Copy,
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

const GeneratorPage = ({
  topic,
  setTopic,
  generatedTweet,
  isGenerating,
  handleGenerateTweet,
  isAuthenticated,
  handlePostTweet,
  isPosting,
  postedTweetUrl,
  optimizationHistory,
  success,
  setSuccess,
}) => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI Tweet Generator
        </h1>
        <p className="text-gray-600">
          Enter a topic and let AI create the perfect tweet for you
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tweet Topic
            </label>
            <div className="relative">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter your tweet topic (e.g., artificial intelligence, coffee, productivity)"
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                onKeyDown={(e) =>
                  e.key === "Enter" && !isGenerating && handleGenerateTweet()
                }
              />
            </div>
          </div>

          <button
            onClick={handleGenerateTweet}
            disabled={isGenerating || !topic.trim()}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Generating & Optimizing...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Generate & Optimize Tweet</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Tweet */}
      {generatedTweet && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Generated Tweet
          </h3>
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">AI Assistant</div>
                <div className="text-gray-700 mt-1 whitespace-pre-wrap">
                  {generatedTweet}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  {generatedTweet.length}/280 characters
                </div>
              </div>
              {/* Copy Button */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedTweet.replace(/["']/g, ""));
                  setSuccess("Tweet copied to clipboard!");
                  setTimeout(() => setSuccess(""), 5000);
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                aria-label="Copy tweet"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {isAuthenticated ? (
              <button
                onClick={handlePostTweet}
                disabled={isPosting || postedTweetUrl}
                className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 disabled:opacity-50 transition-all"
              >
                {isPosting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Posting to X...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Post to My Twitter</span>
                  </>
                )}
              </button>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-yellow-800 text-sm flex items-center">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login with X to post tweets directly to your account
                </p>
              </div>
            )}

            {postedTweetUrl && (
              <a
                href={postedTweetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all"
              >
                <ExternalLink className="h-4 w-4 text-white" />
                <span className="text-white">View Tweet</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Optimization History */}
      {optimizationHistory.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            AI Optimization Process
          </h3>
          <div className="space-y-4">
            {optimizationHistory.map((item, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                    Version: {index + 1}
                  </span>
                  <button
                    onClick={() => {
                        navigator.clipboard.writeText(item.tweet.replace(/["']/g, ''));
                        setSuccess("Tweet copied to clipboard!");
                        setTimeout(() => setSuccess(""), 5000);
                    }}
                    className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                    aria-label="Copy tweet"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-gray-700 text-sm mb-1 font-mono bg-gray-50 p-2 rounded whitespace-pre-wrap">
                  {item.tweet}
                </div>
                <p className="text-gray-500 text-xs">
                  🔧 {item.feedback || "Optimization step"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

export default GeneratorPage;
