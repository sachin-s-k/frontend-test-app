import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    // Navigate to the events page
    navigate("/events/670460373e523917025b8f78");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="text-center">
        {/* Main Title */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Welcome to LIT School Bangalore
        </h1>

        {/* Subtitle */}
        <p className="text-2xl md:text-3xl mb-12 font-semibold">
          Learn Innovate Transform
        </p>

        {/* Navigation Button */}
        <button
          onClick={handleNavigate}
          className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Move to Our Events
        </button>
      </div>
    </div>
  );
};

export default Welcome;
