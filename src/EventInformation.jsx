import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EventInformation = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [eventInfo, setEventInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Handle button click to navigate to the registration form page
  const handleFillFormClick = () => {
    navigate(`/events/register/${eventId}`); // Assuming the registration form is at the '/register' route
  };

  useEffect(() => {
    console.log("event Information useEffect", eventId);
    const fetchEventInfo = async () => {
      console.log("function called");

      try {
        const response = await axios.get(
          `http://localhost:3000/events/${eventId}`
        );
        console.log(response, "resssss");

        setEventInfo(response.data.data);
      } catch (err) {}
    };

    fetchEventInfo();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-3xl w-full mx-auto p-8 bg-gray-800 rounded-lg shadow-lg">
        {/* LIT School Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">LIT School</h1>
          <h2 className="text-lg font-semibold text-gray-400">
            Learn Innovate Transform
          </h2>
        </div>

        {/* Event Information Section */}
        <div className="bg-gray-700 p-8 rounded-lg shadow-md text-white">
          {/* Invitation Message */}
          <p className="text-lg mb-4 text-center">
            <strong className="text-xl">
              You have been invited to register as a participant for
            </strong>
          </p>

          {/* Event Name */}
          <h1 className="text-4xl font-bold text-yellow-400 text-center mb-6">
            {eventInfo.title}
          </h1>

          {/* Event Details (Category and Team Size in Oval-shaped Boxes) */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="px-6 py-2 rounded-full bg-gray-600 text-white text-lg">
              {eventInfo.category}
            </div>
            <div className="px-6 py-2 rounded-full bg-gray-600 text-white text-lg">
              Team of 2-{eventInfo.maxTeamSize} Members
            </div>
          </div>

          {/* Guidelines */}
          <h2 className="text-xl font-semibold mb-2">Guidelines:</h2>
          <ul className="list-disc list-inside space-y-2 pl-4 text-lg">
            {eventInfo.rulesAndRegulations?.map((rules) => {
              return <li>{rules}</li>;
            })}
          </ul>

          {/* Registration Button */}
          <button
            onClick={handleFillFormClick}
            className="mt-8 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Fill Registration Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventInformation;
