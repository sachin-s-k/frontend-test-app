import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TeamRegistrationForm from "./TeamRegistrationForm"; // Update the path as needed
import OTPPage from "./OTPPage"; // Update the path as needed
import EventInformation from "./EventInformation";
import Login from "./LogIn";
import Signup from "./Signup";
import Success from "./Success";
import TeamRegistration from "./TeamRegistration";
//import Test from "./Test";
import Registration from "./Registration";
import Dashboard from "./Dashboard";
import Welcome from "./Welcome";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/events/:eventId" element={<EventInformation />} />
          <Route path="/events/register/:eventId" element={<Registration />} />
          <Route path="/otp/:eventId" element={<OTPPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/success" element={<Success />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
