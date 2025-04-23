import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function RegisterPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Ensure the font is applied consistently
    if (!document.querySelector('link[href*="Inter"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
      document.head.appendChild(link);
      
      document.body.style.fontFamily = "'Inter', sans-serif";
    }
    
    const selectedEvent = location.state?.event;
    if (selectedEvent) {
      setEvent(selectedEvent);
    } else {
      setError("No event selected.");
    }
  }, [location]);

  const handleRegister = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !event) {
      setError("Missing user or event information.");
      return;
    }

    try {
      // Fixed endpoint from /login to /register
      const response = await axios.post("http://192.168.1.16:5000/register", {
        user_id: user.id,
        event_id: event.id
      });

      if (response.data.success) {
        setSuccess("Successfully registered for the event!");
        setError("");
      } else {
        setError(response.data.message || "Failed to register. Please try again.");
      }
    } catch (err) {
      console.error("Register error:", err);
      setError("An error occurred while registering.");
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-200 bg-gradient-to-b from-slate-900 to-indigo-900 font-['Inter',sans-serif]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-400 mr-3"></div>
        <p className="font-light tracking-wide">Loading event details...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-900 to-indigo-900 text-slate-200 flex flex-col pb-24 font-['Inter',sans-serif]">
      
      {/* Header with Back */}
      <div className="flex items-center px-4 sm:px-6 py-5 bg-slate-900/80 shadow-md backdrop-blur-sm">
        <button onClick={() => navigate(-1)} className="mr-4 text-slate-300 hover:text-slate-100 transition-colors flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
        <h2 className="text-xl font-semibold text-slate-100 truncate tracking-tight">{event.title}</h2>
      </div>

      {/* Event Image - Improved styling */}
      <div className="px-4 sm:px-6 pt-6">
        <div className="rounded-xl overflow-hidden shadow-lg">
          <img
            src={event.url}
            alt="Event Banner"
            className="w-full h-48 sm:h-56 object-cover"
          />
        </div>
      </div>

      {/* Details Section */}
      <div className="px-4 sm:px-6 mt-6 space-y-4 flex-grow">
        <div className="flex justify-between bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
          <span className="text-slate-300 font-light">Club:</span>
          <span className="font-medium text-slate-100">{event.club}</span>
        </div>
        <div className="flex justify-between bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
          <span className="text-slate-300 font-light">Date:</span>
          <span className="font-medium text-slate-100">
            {new Date(event.date).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </span>
        </div>
        <div className="flex justify-between bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
          <span className="text-slate-300 font-light">Time:</span>
          <span className="font-medium text-slate-100">{event.time}</span>
        </div>
        <div className="flex justify-between bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
          <span className="text-slate-300 font-light">Venue:</span>
          <span className="font-medium text-slate-100">{event.venue}</span>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="bg-red-900/30 border border-red-800/30 rounded-lg p-4 text-red-300 text-center mt-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-900/30 border border-green-800/30 rounded-lg p-4 text-green-300 text-center mt-6">
            {success}
          </div>
        )}
      </div>

      {/* Register Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 p-5 shadow-lg border-t border-slate-800/50 backdrop-blur-sm">
        <button
          onClick={handleRegister}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3.5 rounded-lg transition-colors shadow-md flex items-center justify-center"
        >
          <span>Register Now</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;