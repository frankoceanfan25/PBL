import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import App from "./App";
import Navbar from "./components/Navbar";

import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import SearchPage from "./pages/SearchPage";
import CalendarPage from "./pages/CalendarPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from './pages/RegisterPage';
import ClubsPage from './pages/ClubsPage'; // Import the new ClubsPage

// Auth check function
const AuthCheck = ({ children }) => {
  const user = localStorage.getItem("user");
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        
        {/* Protected routes */}
        <Route path="/home" element={
          <AuthCheck>
            <>
              <App />
              <Navbar />
            </>
          </AuthCheck>
        } />
        <Route path="/search" element={
          <AuthCheck>
            <>
              <SearchPage />
              <Navbar />
            </>
          </AuthCheck>
        } />
        <Route path="/calendar" element={
          <AuthCheck>
            <>
              <CalendarPage />
              <Navbar />
            </>
          </AuthCheck>
        } />
        <Route path="/notifications" element={
          <AuthCheck>
            <>
              <NotificationsPage />
              <Navbar />
            </>
          </AuthCheck>
        } />
        <Route path="/profile" element={
          <AuthCheck>
            <>
              <ProfilePage />
              <Navbar />
            </>
          </AuthCheck>
        } />
        <Route path="/clubs" element={ // Add new route for ClubsPage
          <AuthCheck>
            <>
              <ClubsPage />
              <Navbar />
            </>
          </AuthCheck>
        } />
        <Route path="/register" element={
          <AuthCheck>
            <>
              <RegisterPage />
            </>
          </AuthCheck>
        } />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
