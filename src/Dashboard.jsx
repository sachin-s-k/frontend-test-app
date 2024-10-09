// src/components/Dashboard.js
import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Logic for logout (e.g., clear user session, token, etc.)
    // Navigate to the login page
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full mx-auto p-8 bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Welcome to Your Dashboard!
        </h1>
        <p className="text-center text-gray-300 mb-4">
          This is your personal dashboard. Here you can manage your account and
          access other features.
        </p>

        <button
          onClick={handleLogout}
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
