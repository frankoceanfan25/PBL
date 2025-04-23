import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventLoading, setEventLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    pastEvents: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      console.log("Retrieved user data:", userData);
      
      if (userData && userData.id) {
        setUser(userData);
        // After getting user data, fetch their registered events
        fetchUserEvents(userData.id);
      } else {
        console.warn("No valid user data found in localStorage");
        // Redirect to login if no user data found
        navigate("/");
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const fetchUserEvents = async (userId) => {
    setEventLoading(true);
    try {
      console.log(`Fetching events for user ID: ${userId}`);
      
      // Fetch user's registered events from the server
      const response = await axios.get(`http://192.168.1.16:5000/user-events/${userId}`);
      console.log("User events response:", response.data);
      
      if (response.data && Array.isArray(response.data)) {
        const events = response.data;
        setRegisteredEvents(events);
        
        // Calculate statistics
        const now = new Date();
        const upcoming = events.filter(event => new Date(event.date) >= now);
        const past = events.filter(event => new Date(event.date) < now);
        
        setStats({
          totalEvents: events.length,
          upcomingEvents: upcoming.length,
          pastEvents: past.length
        });
      } else {
        console.warn("Unexpected response format:", response.data);
        setRegisteredEvents([]);
        setStats({
          totalEvents: 0,
          upcomingEvents: 0,
          pastEvents: 0
        });
      }
    } catch (error) {
      console.error("Error fetching user events:", error);
      setRegisteredEvents([]);
      setStats({
        totalEvents: 0,
        upcomingEvents: 0,
        pastEvents: 0
      });
    } finally {
      setEventLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };
  
  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Format time function
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    // Convert 24-hour format to AM/PM
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-900 text-white flex items-center justify-center font-['Inter',sans-serif]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-300"></div>
          <p className="mt-4 text-indigo-200 font-light tracking-wide">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-900 text-white flex items-center justify-center font-['Inter',sans-serif]">
        <div className="flex flex-col items-center text-center px-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="text-xl font-medium mb-2">User Session Expired</h2>
          <p className="text-indigo-200 mb-6">Please log in again to view your profile</p>
          <button 
            onClick={() => navigate("/")} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-900 to-indigo-900 text-white pb-24 font-['Inter',sans-serif]">
      {/* Header */}
      <div className="bg-slate-900/60 shadow-md backdrop-blur-sm py-6">
        <div className="container max-w-lg mx-auto px-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">My Profile</h1>
          <div className="flex space-x-2">
            <button 
              onClick={handleLogout}
              className="bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/50 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="container max-w-lg mx-auto px-4 py-8">
        {/* Avatar and Name */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-24 w-24 rounded-full bg-indigo-600/30 border-2 border-indigo-500/50 flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/10">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <h2 className="mt-4 text-xl font-medium">{user?.name || "User"}</h2>
          <p className="text-indigo-300 text-sm">{user?.email || "No email available"}</p>
          
          {/* Stats Cards */}
          <div className="w-full grid grid-cols-3 gap-3 mt-6">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 text-center">
              <span className="text-2xl font-semibold text-white">{stats.totalEvents}</span>
              <p className="text-xs text-slate-400 mt-1">Total Events</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 text-center">
              <span className="text-2xl font-semibold text-indigo-400">{stats.upcomingEvents}</span>
              <p className="text-xs text-slate-400 mt-1">Upcoming</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 text-center">
              <span className="text-2xl font-semibold text-slate-400">{stats.pastEvents}</span>
              <p className="text-xs text-slate-400 mt-1">Past</p>
            </div>
          </div>
        </div>

        {/* User Details */}
        <div className="bg-slate-800/50 rounded-xl p-6 shadow-lg border border-slate-700/50">
          <h3 className="text-lg font-medium mb-4 text-indigo-300">Account Details</h3>
          
          <div className="space-y-4">
            <div className="flex flex-col space-y-1">
              <label className="text-sm text-slate-400">Name</label>
              <div className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3">
                {user?.name || "User"}
              </div>
            </div>
            
            <div className="flex flex-col space-y-1">
              <label className="text-sm text-slate-400">Email</label>
              <div className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3">
                {user?.email || "email@example.com"}
              </div>
            </div>
            
            <div className="flex flex-col space-y-1">
              <label className="text-sm text-slate-400">Enrollment Number</label>
              <div className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3">
                {user?.enrollment_number || "Not available"}
              </div>
            </div>
            
            <div className="flex flex-col space-y-1">
              <label className="text-sm text-slate-400">User ID</label>
              <div className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3">
                {user?.id || "Not available"}
              </div>
            </div>
          </div>
        </div>
        
        {/* My Events Section */}
        <div className="mt-6 bg-slate-800/50 rounded-xl p-6 shadow-lg border border-slate-700/50">
          <h3 className="text-lg font-medium mb-4 text-indigo-300">My Events</h3>
          
          {eventLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-300"></div>
            </div>
          ) : registeredEvents.length > 0 ? (
            <div className="space-y-4">
              {registeredEvents.map(event => {
                const eventDate = new Date(event.date);
                const isPast = eventDate < new Date();
                
                return (
                  <div 
                    key={event.id} 
                    className={`bg-slate-700/30 border rounded-lg p-4 ${
                      isPast ? 
                      'border-slate-600/30 opacity-70' : 
                      'border-indigo-500/30 shadow-indigo-500/10'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="w-16 h-16 bg-indigo-800/30 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                        <img 
                          src={event.url || "https://picsum.photos/seed/event/64"} 
                          alt={event.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-white">{event.title || "Untitled Event"}</h4>
                          {isPast ? (
                            <span className="text-xs bg-slate-700/80 text-slate-300 px-2 py-1 rounded">Past</span>
                          ) : (
                            <span className="text-xs bg-indigo-900/80 text-indigo-200 px-2 py-1 rounded">Upcoming</span>
                          )}
                        </div>
                        <p className="text-sm text-indigo-300 mt-1">
                          {event.club || "Event Club"}
                        </p>
                        <div className="flex flex-col mt-2 text-xs text-slate-400">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(event.date)}
                          </div>
                          <div className="flex items-center mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatTime(event.time)}
                          </div>
                          <div className="flex items-center mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {event.venue || "TBA"}
                          </div>
                          {event.registration_date && (
                            <div className="flex items-center mt-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Registered: {formatDate(event.registration_date)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-8 flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-3 text-slate-400 text-center">No registered events yet</p>
              <button 
                onClick={() => navigate("/home")} 
                className="mt-4 bg-indigo-600/60 hover:bg-indigo-600/80 text-white text-sm rounded-lg px-4 py-2"
              >
                Browse Events
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
