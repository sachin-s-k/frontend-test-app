import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { storeMembers } from "./app-store/registerSlice";

const OTPPage = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  // member data reading
  const verificationPhoneData = useSelector(
    (state) => state.registration.verificationPhoneData
  );

  console.log("verificationPhoneData====>", verificationPhoneData);

  const teamMembers = useSelector((state) => state.registration.membersData);
  const teamData = useSelector((state) => state.registration.teamData);
  const numberVerifyData = useSelector(
    (state) => state.registration.numberVerifyData
  );
  console.log(teamMembers, "otppppp", teamData, "==", numberVerifyData);

  //

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [resendEnabled, setResendEnabled] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef(null); // To keep track of the interval

  // Function to start the timer
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current); // Clear any existing timer
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev > 0) return prev - 1;
        setResendEnabled(true); // Enable the resend button when the timer hits 0
        clearInterval(timerRef.current); // Stop the timer
        return 0;
      });
    }, 1000);
  };

  // Start the timer on component mount
  useEffect(() => {
    console.log("otp");

    startTimer();
    return () => clearInterval(timerRef.current); // Cleanup timer on component unmount
  }, []);

  // Handle OTP input change
  const handleChange = (e, index) => {
    const { value } = e.target;
    if (value.length > 1) return; // Prevent more than one character input

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Automatically move to the next input if current input is filled
    if (value !== "" && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  // Handle OTP submission
  const handleSubmit = async () => {
    console.log("handle submit");

    const enteredOtp = otp.join("");
    //Combine the OTP array into a single string
    console.log(enteredOtp, "ente");

    // Navigate and reload as needed

    try {
      // Make an API request to verify the OTP
      const response = await axios.post(
        `http://localhost:3000/events/registration/${eventId}/verify-otp`,
        {
          otp: enteredOtp,
          mobileNumber: numberVerifyData.mobileNumber,
          // Payload to send to the server
        }
      );

      // Check if the OTP verification was successful based on the response
      if (response.status === 200) {
        // OTP verified successfully

        const updatedMembers = teamMembers.map((member, index) =>
          index === numberVerifyData.index
            ? { ...member, verified: true }
            : member
        );

        // Dispatch the updated members to the store
        dispatch(storeMembers(updatedMembers));
        alert("OTP verified successfully!");
        navigate(`/events/register/${eventId}`);
        window.location.reload();
      } else {
        // Handle any other status codes that indicate failure
        setError("Invalid OTP, please try again.");
      }
    } catch (error) {
      console.error(error, "errrorrrr");

      // Handle error from the request
      if (error.response && error.response.data) {
        // Set the error message from the backend response if available
        setError(error.response.data.message);
      } else {
        // Handle unexpected errors
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  // Handle OTP Resend
  const handleResend = async () => {
    alert("Resending OTP...");

    try {
      // Make an API request to the backend to resend the OTP
      const response = await axios.post(
        `http://localhost:3000/events/registration/${eventId}/verify-number`,
        {
          email: numberVerifyData.email,
          mobileNumber: numberVerifyData.mobileNumber, // You might need to pass additional user data like email or phone number
        }
      );

      // Handle response
      if (response.status === 200) {
        alert("OTP has been resent successfully!");

        // Reset OTP and timer state
        setOtp(["", "", "", "", "", ""]);
        setTimer(300); // Reset timer to 5 minutes
        setResendEnabled(false); // Disable resend button again

        // Restart the timer
        startTimer();

        // Refocus to the first OTP input
        document.getElementById("otp-input-0").focus();
      } else {
        console.error("Failed to resend OTP:", response.data);
        alert("Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error during OTP resend:", error);
      // If the backend responds with an error or network error occurs, show an error message
      alert(
        error.response?.data?.message ||
          "An error occurred while resending OTP."
      );
    }
  };

  // Format time as mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-sm mx-auto p-8 bg-gray-900 rounded-lg shadow-lg">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-6">Enter OTP</h1>

        {/* OTP Input Fields */}
        <div className="flex justify-center mb-4 space-x-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              className="w-12 h-12 text-center border-2 border-gray-500 rounded-lg text-2xl focus:border-blue-500 focus:outline-none bg-gray-800 text-white"
            />
          ))}
        </div>

        {/* Error Message */}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {/* Timer Display */}
        <div className="text-center mb-4">
          <span className="text-lg">Time remaining: {formatTime(timer)}</span>
        </div>

        {/* Verify OTP Button */}
        <button
          onClick={handleSubmit}
          className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold"
        >
          Verify OTP
        </button>

        {/* Resend OTP Button */}
        <button
          onClick={handleResend}
          className={`w-full mt-4 py-2 rounded-md text-white font-semibold ${
            resendEnabled
              ? "bg-orange-600 hover:bg-orange-700"
              : "bg-gray-500 cursor-not-allowed"
          }`}
          disabled={!resendEnabled}
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default OTPPage;
