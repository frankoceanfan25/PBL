import { useNavigate } from "react-router-dom";

function EventCard({ event }) {
  const navigate = useNavigate();
  
  const handleRegisterClick = () => {
    // Ensure the event has an ID before navigating
    if (!event.id) {
      console.error("Event is missing ID:", event);
      return;
    }
    
    console.log("Navigating to register with event:", event);
    navigate("/register", { state: { event: event } });
  };

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/50 hover:border-indigo-500/30 shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 relative group">
      {/* Event Image */}
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <img
          src={event.url}
          alt={event.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
        
        {/* Date badge */}
        <div className="absolute top-3 right-3 bg-indigo-900/90 text-indigo-100 text-xs font-medium px-2.5 py-1.5 rounded shadow-md backdrop-blur-sm border border-indigo-700/50">
          {new Date(event.date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          })}
        </div>
      </div>
      
      {/* Event Details */}
      <div className="p-4">
        <div className="flex items-center mb-2">
          <span className="text-xs text-slate-400">{event.club}</span>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{event.title}</h3>
        
        <div className="flex items-center mb-3 text-sm text-slate-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{event.venue}</span>
        </div>
        
        {/* CTA Button - Changed to a real button for better accessibility */}
        <button
          onClick={handleRegisterClick}
          className="w-full mt-2 py-2 px-3 bg-indigo-600/80 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg flex items-center justify-center transition-colors"
        >
          Register Now
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default EventCard;
