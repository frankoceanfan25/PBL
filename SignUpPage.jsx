import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    // Validation
    if (!email || !password || !confirmPassword || !enrollmentNumber) {
      setError("Please fill in all required fields");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (enrollmentNumber.length < 5) {
      setError("Please enter a valid enrollment number");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      // Match payload field names exactly to database structure
      const payload = {
        email: email,
        password: password,           // Backend should hash this
        password_hash: password,      // Alternative if backend expects this directly
        name: name || email.split('@')[0],
        enrollment_number: enrollmentNumber
      };
      
      console.log("Sending signup request with payload:", payload);
      
      // Use Axios directly with more explicit options
      const response = await axios({
        method: 'post',
        url: 'http://192.168.1.16:5000/signup',
        data: payload,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Signup response:", response.data);

      if (response.data && (response.data.success || response.status === 201 || response.status === 200)) {
        // Show success and redirect to login
        navigate("/", { 
          state: { message: "Account created successfully! Please log in." } 
        });
      } else {
        // Display the specific error message from the server
        setError(response.data?.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Sign up error", err);
      
      if (err.response && err.response.data && err.response.data.sqlMessage) {
        // Handle SQL-specific errors
        const sqlMessage = err.response.data.sqlMessage;
        
        if (sqlMessage.includes("Duplicate entry") && sqlMessage.includes("email")) {
          setError("An account with this email already exists.");
        } else if (sqlMessage.includes("Duplicate entry") && sqlMessage.includes("enrollment_number")) {
          setError("This enrollment number is already registered.");
        } else {
          setError("Database error: " + sqlMessage);
        }
      } else if (err.response) {
        setError(err.response.data?.message || `Error ${err.response.status}: Registration failed`);
      } else if (err.request) {
        setError("No response from server. Please check your connection and try again.");
      } else {
        setError("Unable to send registration request. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-900 to-indigo-900 text-white flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-slate-800/90 rounded-xl shadow-xl p-6 sm:p-8 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-white">Create Account</h2>
        <p className="text-slate-400 text-center text-sm">Sign up to access campus events</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">Email<span className="text-red-400">*</span></label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg bg-slate-700/80 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">Name <span className="text-slate-400 text-xs">(optional)</span></label>
            <input
              type="text"
              placeholder="Your full name"
              className="w-full px-4 py-3 rounded-lg bg-slate-700/80 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">Enrollment Number<span className="text-red-400">*</span></label>
            <input
              type="text"
              placeholder="e.g. EN12345"
              className="w-full px-4 py-3 rounded-lg bg-slate-700/80 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={enrollmentNumber}
              onChange={(e) => setEnrollmentNumber(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">Password<span className="text-red-400">*</span></label>
            <input
              type="password"
              placeholder="Create a strong password"
              className="w-full px-4 py-3 rounded-lg bg-slate-700/80 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">Confirm Password<span className="text-red-400">*</span></label>
            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full px-4 py-3 rounded-lg bg-slate-700/80 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSignUp();
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
            onClick={handleSignUp} 
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition duration-200 flex items-center justify-center shadow-lg hover:shadow-indigo-700/30"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Creating account...</span>
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
          
          <p className="text-slate-400 text-sm text-center mt-4">
            Already have an account? <span 
              className="text-indigo-400 hover:text-indigo-300 cursor-pointer"
              onClick={() => navigate("/")}
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;