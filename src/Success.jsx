// src/components/Success.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa"; // Import the check icon
import { useSelector } from "react-redux";

const Success = () => {
  const navigate = useNavigate();
  const registeredMembers = useSelector(
    (state) => state.registration.registeredData
  );

  console.log(registeredMembers, "registered");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      {/* Main Container */}
      <div className="max-w-3xl w-full mx-auto p-8 rounded-lg shadow-lg">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          You Have Successfully Registered Your Team for Social Media Maverick!
        </h1>

        {/* Sub Title */}
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-300">
          Sign up to access your EPIC Dashboard below:
        </h2>

        {/* Registered Members List */}
        <h3 className="text-lg font-medium text-white text-center mb-4">
          Registered Members:
        </h3>
        <ul className="flex flex-col items-center space-y-4 mb-6">
          {registeredMembers?.map((member, index) => (
            <li key={index} className="flex items-center space-x-3 text-white">
              {/* Verified Symbol */}
              <FaCheckCircle className="text-green-500" />
              <span className="text-lg">{member}</span>
            </li>
          ))}
        </ul>

        {/* Button Container */}
        <div className="flex justify-center space-x-4">
          {/* Sign Up Button */}
          <button
            onClick={() => navigate("/signup")}
            className="px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Sign Up
          </button>

          {/* Move to Events Button */}
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Move to Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;
