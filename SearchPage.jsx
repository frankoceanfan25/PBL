import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EventCard from '../components/EventCard';

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ events: [], clubs: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Use an API URL that is accessible - adjust if needed
  // Using a local address that will work with the current setup
  const API_URL = "http://192.168.1.16:5000"; // Adjust this if your server is running on a different address

  // Function to handle search with improved error handling
  const handleSearch = async () => {
    if (!query.trim()) {
      setResults({ events: [], clubs: [] });
      setSearchPerformed(false);
      return;
    }
    
    setIsSearching(true);
    setSearchPerformed(true);
    setError("");
    
    try {
      console.log(`Searching for: "${query}"`);
      // Implement a more resilient search that doesn't rely on the description field
      // This simplified search only uses title and name fields which should exist in the database
      
      // Manual filtering approach as fallback - we'll first try the API, then do client-side filtering if needed
      const eventsResponse = await axios.get(`${API_URL}/events`);
      const clubsResponse = await axios.get(`${API_URL}/clubs`);
      
      const allEvents = eventsResponse.data || [];
      const allClubs = clubsResponse.data || [];
      
      // Try the server-side search first
      try {
        const searchResponse = await axios.get(`${API_URL}/search?query=${encodeURIComponent(query)}`);
        console.log("Server search results:", searchResponse.data);
        
        if (searchResponse.data && 
            (Array.isArray(searchResponse.data.events) || Array.isArray(searchResponse.data.clubs))) {
          setResults(searchResponse.data);
          setIsSearching(false);
          return;
        }
      } catch (searchErr) {
        console.warn("Server-side search failed, falling back to client-side filtering:", searchErr);
        // Continue to client-side filtering
      }
      
      // Client-side filtering as fallback
      console.log("Using client-side filtering as fallback");
      const queryLower = query.toLowerCase();
      
      const filteredEvents = allEvents.filter(event => 
        event.title.toLowerCase().includes(queryLower) || 
        (event.venue && event.venue.toLowerCase().includes(queryLower)) ||
        (event.club && event.club.toLowerCase().includes(queryLower))
      );
      
      const filteredClubs = allClubs.filter(club => 
        club.name.toLowerCase().includes(queryLower)
      );
      
      setResults({ 
        events: filteredEvents, 
        clubs: filteredClubs 
      });
      
      console.log("Client-side filtered results:", {
        events: filteredEvents,
        clubs: filteredClubs
      });
      
    } catch (err) {
      console.error("Search error:", err);
      setResults({ events: [], clubs: [] });
      setError(`Search failed: ${err.message}. Please ensure the server is running.`);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    // If the search box is cleared, reset results
    if (!e.target.value.trim()) {
      setResults({ events: [], clubs: [] });
      setSearchPerformed(false);
    }
  };

  // Reset search when component mounts
  useEffect(() => {
    setQuery("");
    setResults({ events: [], clubs: [] });
    setSearchPerformed(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-900 text-white pb-20 font-['Inter',sans-serif]">
      {/* Search Bar */}
      <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-lg shadow-md border-b border-slate-800 p-4">
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search events, clubs, venues..."
            value={query}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg py-3 pl-4 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-700/50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search Results */}
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        {isSearching ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-300"></div>
          </div>
        ) : searchPerformed ? (
          <>
            {/* Show if error occurred */}
            {error && (
              <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4 mb-6">
                <p className="text-red-300">{error}</p>
              </div>
            )}
            
            {/* Show if no results found */}
            {!error && results.events.length === 0 && results.clubs.length === 0 && (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-slate-300">No results found for "{query}"</h3>
                <p className="mt-2 text-slate-400">Try different keywords or check your spelling</p>
              </div>
            )}

            {/* Club Results */}
            {results.clubs && results.clubs.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Clubs ({results.clubs.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {results.clubs.map(club => (
                    <div 
                      key={club.id} 
                      onClick={() => navigate("/clubs")}
                      className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300 shadow-md hover:shadow-indigo-500/10 cursor-pointer"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-800 shadow-lg mb-3">
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
                        <h3 className="text-sm font-medium text-slate-200 text-center">{club.name}</h3>
                        <p className="text-xs text-slate-400 mt-1 text-center line-clamp-2">{club.description || "Club at MIT ADT University"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Event Results */}
            {results.events && results.events.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Events ({results.events.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.events.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-slate-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-medium text-slate-300">Search for events and clubs</h3>
            <p className="mt-2 text-slate-500">Find what's happening around campus</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
