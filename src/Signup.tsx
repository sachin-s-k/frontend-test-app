// src/components/Signup.js
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let valid = true;

    // Validate email format
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    } else {
      setEmailError(""); // Clear any previous email error if the format is valid
    }

    // Validate password and confirm password match
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      valid = false;
    } else {
      setPasswordError(""); // Clear any previous password error if they match
    }

    // Stop submission if validation fails
    if (!valid) return;

    // Create the user object to send to the backend
    const userData = {
      email,
      password,
    };

    try {
      // Send the data to your backend for registration
      const response = await axios.post(
        "http://localhost:3000/user/signup",
        userData
      );

      // Assuming the backend responds with a success message
      console.log("Registration successful:", response.data.token);

      if (response.data.token) {
        navigate("/dashboard");
      }
    } catch (error) {
      // Handle errors from the backend
      console.log(error);
      if (error.response.data.message) {
        setEmailError(error.response.data.message);
      }

      if (error.response.data.errors[0].msg) {
        setPasswordError(error.response.data.errors[0]?.msg);
      }

      if (error.response) {
        // Server responded with a status other than 2xx
        alert(
          `Error: ${
            error.response.data.message ||
            "An error occurred during registration."
          }`
        );
      } else if (error.request) {
        // Request was made but no response was received
        alert("No response from server. Please try again later.");
      } else {
        // Something happened in setting up the request
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full mx-auto p-8 bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Sign Up
        </h1>
        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-800 text-white border-gray-500 shadow-sm focus:ring-0 focus:border-blue-400 sm:text-sm p-3"
              required
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-800 text-white border-gray-500 shadow-sm focus:ring-0 focus:border-blue-400 sm:text-sm p-3"
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-300"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-800 text-white border-gray-500 shadow-sm focus:ring-0 focus:border-blue-400 sm:text-sm p-3"
              required
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign Up
          </button>

          <p className="text-center text-sm text-gray-300 mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-500 hover:text-blue-400 cursor-pointer"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
