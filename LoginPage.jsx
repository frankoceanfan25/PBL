import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for success message from sign-up page
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      
      // Clear the message from location state to prevent showing it
      // after page refreshes
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      console.log("Sending login request with:", { email, password });
      
      // Match payload to what the server expects
      const payload = {
        username: email, // NOTE: Server expects 'username', not 'email'
        password: password
      };
      
      console.log("Login payload:", payload);
      
      const response = await axios({
        method: 'post',
        url: 'http://192.168.1.16:5000/login',
        data: payload,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Login response:", response.data);

      if (response.data.success || response.status === 200) {
        // Make sure user object has all needed properties including ID
        const userData = response.data.user || {};
        console.log("User data to store:", userData);
        
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Navigate to /home route
        navigate("/home");
      } else {
        setError(response.data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error", err);
      
      if (err.response) {
        console.error("Server response error:", err.response.data);
        setError(err.response.data?.message || "Invalid credentials");
      } else if (err.request) {
        console.error("No response received:", err.request);
        setError("No response from server. Please check your connection.");
      } else {
        console.error("Request setup error:", err.message);
        setError("Unable to connect. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-900 to-indigo-900 text-white flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-slate-800/90 rounded-xl shadow-xl p-6 sm:p-8 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-white">Welcome Back</h2>
        <p className="text-slate-400 text-center text-sm">Sign in to continue to your account</p>
        
        <div className="space-y-4">
          {successMessage && (
            <div className="px-3 py-2 bg-green-900/30 border border-green-500/30 rounded-lg">
              <p className="text-green-400 text-sm">{successMessage}</p>
            </div>
          )}
          
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg bg-slate-700/80 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="password"
              className="w-full px-4 py-3 rounded-lg bg-slate-700/80 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLogin();
                }
              }}
            />
          </div>
          
          {error && (
            <div className="px-3 py-2 bg-red-900/30 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          <button 
            onClick={handleLogin} 
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition duration-200 flex items-center justify-center shadow-lg hover:shadow-indigo-700/30"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </button>
          
          <p className="text-slate-400 text-sm text-center mt-4">
            Don't have an account? <span 
              className="text-indigo-400 hover:text-indigo-300 cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
