import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EventCard from './components/EventCard';

function App() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Add the Google Font import to the document head
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(link);
    
    // Apply the font to the entire body
    document.body.style.fontFamily = "'Inter', sans-serif";
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const [eventsRes, clubsRes] = await Promise.all([
          axios.get("http://192.168.1.16:5000/events"),
          axios.get("http://192.168.1.16:5000/clubs")
        ]);
        
        setEvents(eventsRes.data);
        setClubs(clubsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Clean up function
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Handle See All Clubs click
  const handleSeeAllClubs = () => {
    navigate("/clubs");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-900 text-white flex items-center justify-center font-['Inter',sans-serif]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-300"></div>
          <p className="mt-4 text-indigo-200 font-light tracking-wide">Loading your events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-900 text-white flex items-center justify-center p-6 font-['Inter',sans-serif]">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 max-w-md shadow-lg border border-slate-700/50">
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-slate-300">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-indigo-700/30"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-['Inter',sans-serif] relative bg-gradient-to-b from-slate-900 to-indigo-900">
      {/* Fixed Banner with Parallax Effect - fixed position with original height */}
      <header className="fixed top-0 left-0 w-full h-72 sm:h-96 overflow-hidden z-0">
        {/* Background image with parallax effect */}
        <div className="absolute inset-0 transform scale-105">
          <img
            src="public/images/mit-adt-new.png"
            alt="Campus Banner"
            className="absolute inset-0 w-full h-full object-cover filter brightness-75"
          />
        </div>

        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 via-purple-900/50 to-slate-900/80"></div>

        {/* Text content with improved typography */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-purple-300 drop-shadow-xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            Campus Events
          </h1>

          {/* Animated underline */}
          <div className="h-[2px] w-24 bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse rounded-full mt-3 mb-4" />

          <p className="text-purple-100 text-sm sm:text-base md:text-lg font-medium max-w-md tracking-wide">
            Discover activities, clubs, and everything happening at MIT ADT — all in one place.
          </p>
        </div>
      </header>

      {/* Scrollable Content that overlays the banner - with a higher z-index */}
      <div className="relative z-10">
        {/* Empty space to allow banner to be visible initially */}
        <div className="h-72 sm:h-96"></div>
        
        {/* Content Panel that slides over banner */}
        <div className="bg-gradient-to-b from-slate-900/95 to-indigo-900/98 backdrop-blur-sm text-white pt-8 pb-20 rounded-t-3xl shadow-xl">
          {/* Decorative handle for sliding panel look */}
          <div className="w-16 h-1 bg-slate-300/30 rounded-full mx-auto mb-8"></div>

          {/* Clubs Section */}
          <section className="mt-2 px-4 sm:px-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-100 tracking-tight">Popular Clubs</h2>
              <button 
                onClick={handleSeeAllClubs}
                className="text-sm text-indigo-300 hover:text-indigo-200 transition-colors flex items-center"
              >
                See All
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="mt-2 overflow-x-auto flex space-x-4 pb-4">
              {clubs.map(club => (
                <div 
                  key={club.id} 
                  className="flex flex-col items-center space-y-2 flex-shrink-0 w-20 cursor-pointer"
                  onClick={() => navigate("/clubs")}
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-800 shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 transform hover:scale-105">
                    <img
                      src={club.logo_url}
                      alt={club.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/100?text=Club';
                      }}
                    />
                  </div>
                  <span className="text-xs text-slate-300 text-center w-20 truncate">{club.name}</span>
                </div>
              ))}
            </div>
          </section>
          
          {/* Events Section */}
          <section className="mt-10 px-4 sm:px-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-100 tracking-tight">Upcoming Events</h2>
              <button className="flex items-center bg-slate-800/70 hover:bg-slate-700/70 px-3 py-1.5 rounded-lg text-sm text-slate-300 transition-all duration-300 border border-slate-700/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                Filter
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.length > 0 ? (
                events.map(event => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <div className="col-span-full bg-slate-800/30 border border-slate-700/30 rounded-xl text-center py-12 px-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-4 text-slate-300">No upcoming events found</p>
                  <p className="mt-2 text-slate-400/70 text-sm">Check back soon for new events</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
