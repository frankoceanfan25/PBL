import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg shadow-lg border-t border-slate-800">
      <div className="w-full mx-auto px-1">
        <div className="flex justify-between items-center h-14">
          {/* Reusable nav buttons */}
          {[
            { path: "/home", iconPath: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
            { path: "/search", iconPath: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
            { path: "/calendar", iconPath: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
            { path: "/clubs", iconPath: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
            { path: "/profile", iconPath: "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
          ].map(({ path, label, iconPath }) => (
            <button 
              key={path}
              onClick={() => navigate(path)}
              className="relative flex flex-col items-center justify-center h-full flex-1 group"
            >
              <div className={`absolute inset-x-0 top-0 h-0.5 ${isActive(path) ? "bg-indigo-500" : "bg-transparent"} transition-all duration-300`}></div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-7 w-7 transition-all duration-300 ${isActive(path) ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={isActive(path) ? 2 : 1.5} 
                  d={iconPath} 
                />
              </svg>
              <span className={`text-[10px] mt-0.5 transition-all duration-300 ${isActive(path) ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"}`}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
