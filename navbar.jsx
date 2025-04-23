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
      <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-b from-violet-950 to-purple-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
        <p className="ml-4 text-purple-300">Loading event details...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-violet-950 to-purple-950 text-white flex flex-col pb-24">
      
      {/* Header with Back */}
      <div className="flex items-center px-6 py-5 bg-violet-900/30 backdrop-blur-sm shadow-lg">
        <button onClick={() => navigate(-1)} className="mr-4 text-purple-300 hover:text-purple-200 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-purple-100">{event.title}</h2>
      </div>

      {/* Event Image - Larger and positioned right after header */}
      <div className="mt-3 px-4">
        <img
          src={event.url}
          alt="Event Banner"
          className="w-full h-56 object-cover rounded-xl shadow-lg border border-violet-800/30"
        />
      </div>

      {/* Details Section */}
      <div className="px-4 mt-6 space-y-4 text-sm flex-1">
        <div className="flex justify-between bg-violet-900/20 rounded-xl p-4 backdrop-blur-sm border border-violet-800/30">
          <span className="text-purple-300">Club:</span>
          <span className="font-medium text-white">{event.club}</span>
        </div>
        <div className="flex justify-between bg-violet-900/20 rounded-xl p-4 backdrop-blur-sm border border-violet-800/30">
          <span className="text-purple-300">Date:</span>
          <span className="font-medium text-white">
          {new Date(event.date).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric"
          })}
          </span>
        </div>
        <div className="flex justify-between bg-violet-900/20 rounded-xl p-4 backdrop-blur-sm border border-violet-800/30">
          <span className="text-purple-300">Time:</span>
          <span className="font-medium text-white">{event.time}</span>
        </div>
        <div className="flex justify-between bg-violet-900/20 rounded-xl p-4 backdrop-blur-sm border border-violet-800/30">
          <span className="text-purple-300">Venue:</span>
          <span className="font-medium text-white">{event.venue}</span>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="bg-red-900/30 border border-red-800/50 p-4 rounded-xl text-center text-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-900/30 border border-green-800/50 p-4 rounded-xl text-center text-green-200">
            {success}
          </div>
        )}
      </div>

      {/* Register Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-violet-900/60 backdrop-blur-sm p-6 shadow-lg border-t border-violet-800/30">
        <button
          onClick={handleRegister}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-600/50 flex items-center justify-center"
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