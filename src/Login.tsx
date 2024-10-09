import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/user/signin",
        userData
      );

      if (response.data.token) {
        console.log("Login successful:", response.data.token);
        localStorage.setItem("authToken", response.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response) {
        alert(`Error: ${error.response.data.message || "Invalid credentials"}`);
      } else if (error.request) {
        alert("No response from server. Please try again later.");
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full mx-auto p-8 bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Login
        </h1>
        <form onSubmit={handleLogin} className="space-y-6">
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

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>

          {/* Link to Signup */}
          <p className="text-center text-sm text-gray-300 mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:text-blue-400">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
