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

const NotificationBar = (
    {
        error,
        success
    }
) => {
    if (!error && !success) return null;

    return (
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-2 shadow-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-2 shadow-lg">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default NotificationBar;