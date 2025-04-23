import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ClubsPage() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClubs = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://192.168.1.16:5000/clubs");
        setClubs(response.data);
      } catch (err) {
        console.error("Error fetching clubs:", err);
        setError("Failed to load clubs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-900 text-white flex items-center justify-center font-['Inter',sans-serif]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-300"></div>
          <p className="mt-4 text-indigo-200 font-light tracking-wide">Loading clubs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-900 text-white pb-20 font-['Inter',sans-serif]">
      {/* Header */}
      <div className="flex items-center px-4 py-5 bg-slate-900/80 shadow-md backdrop-blur-sm sticky top-0 z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="mr-4 text-slate-300 hover:text-slate-100 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
        <h2 className="text-xl font-semibold text-slate-100">All Clubs</h2>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {error ? (
          <div className="bg-red-900/30 border border-red-800/30 rounded-lg p-4 text-red-300 text-center mt-6">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {clubs.map(club => (
              <div key={club.id} className="flex flex-col items-center bg-slate-800/60 rounded-xl p-4 border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300 shadow-md hover:shadow-indigo-500/10">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-800 shadow-lg mb-3">
                  <img
                    src={club.logo_url}
                    alt={club.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-sm font-medium text-slate-200 text-center">{club.name}</h3>
                <p className="text-xs text-slate-400 mt-1 text-center line-clamp-2">{club.description || "Club at MIT ADT University"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClubsPage;
