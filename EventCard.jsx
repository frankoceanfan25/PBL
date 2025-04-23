import { useNavigate } from "react-router-dom";

function EventCard({ event }) {
  const navigate = useNavigate();

  const onRegisterClick = () => {
    navigate("/register", { state: { event } });
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-slate-700/40 hover:border-slate-600/60 hover:shadow-indigo-700/10 transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img 
          src={event.url}
          alt={event.title} 
          className="w-full h-48 object-cover"
        />
        
        {/* Event date badge */}
        <div className="absolute top-3 right-3 bg-indigo-900/80 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-lg shadow-md">
          {new Date(event.date).toLocaleDateString("en-GB")}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-2 text-slate-100 line-clamp-1 tracking-tight">{event.title}</h3>
        
        <div className="flex items-center mb-3 text-slate-300 text-sm">
          {event.logo_url ? (
            <img 
              src={event.logo_url} 
              alt={`${event.club} logo`}
              className="h-5 w-5 mr-2 rounded-full object-cover border border-slate-600/50"
            />
          ) : (
            <div className="h-5 w-5 mr-2 rounded-full bg-slate-700 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6
                8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
          )}
          <span className="font-light">{event.club}</span>
        </div>
        
        <div className="flex flex-col text-slate-400 text-xs space-y-2 mt-3">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="font-light">{event.time}</span>
          </div>
          
          <div className="flex items-center truncate">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="font-light">{event.venue}</span>
          </div>
        </div>
        
        <button
          onClick={onRegisterClick}
          className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-indigo-600/50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800 flex items-center justify-center"
        >
          <span>Register Now</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default EventCard;