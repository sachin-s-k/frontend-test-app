import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { Triangle } from "react-loader-spinner";
import {
  addMobileVerificationData,
  addNumberVerifyData,
  addRegisteredData,
  addTeamData,
  storeMembers,
} from "./app-store/registerSlice";
import axios from "axios";

import { RotatingLines } from "react-loader-spinner";

const TeamRegistration = () => {
  const { eventId } = useParams();
  //mobile verified indication
  const [isLoading, setIsLoading] = useState(false);
  const [numberVerified, setnumberVerified] = useState([
    { indexValue: "", mobile: "", verified: false }, // Example initial state for members
    // Add more members as needed
  ]);

  ///

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [files, setFiles] = useState("");
  const [isTeamCodeAvailable, setIsTeamCodeAvailable] = useState(true); // State to track if the team code is available
  const [teamCodeError, setTeamCodeError] = useState(""); // State to display error message

  const location = useLocation();
  const [mobileError, setMobileError] = useState("");
  const teamMembers = useSelector((state) => state.registration.membersData);
  const teamData = useSelector((state) => state.registration.teamData);
  const teamImageBase64 = teamData.teamImage;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // State for common team fields

  const [instituteInfo, setInstituteInfo] = useState([]);
  const [teamCode, setTeamCode] = useState("");
  const [teamImage, setTeamImage] = useState(null);

  // State for tracking team members
  const [members, setMembers] = useState([
    {
      email: "",
      firstName: "",
      lastName: "",
      mobile: "",
      institute: "",
      customInstitute: "",
      verified: false,
    },
  ]);

  // State to track the number of members added
  const [memberCount, setMemberCount] = useState(1);

  // Handle change for common team fields
  const handleCommonFieldChange = (e) => {
    setTeamCode(e.target.value);
  };

  // Handle image upload for team
  // const handleImageChange = (e) => {
  //   console.log(e.target.files[0]);

  //   setTeamImage(e.target.files[0]);
  // };
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFiles(file);
      const base64Image = await convertFileToBase64(file);
      setTeamImage(base64Image); // Set the Base64 string as the team image

      localStorage.setItem("uploadedFile", JSON.stringify(file));
    }
  };

  // Utility function to convert file to Base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result); // Base64 string returned here
      reader.onerror = (error) => reject(error);
    });
  };

  //Handle change for team member fields
  // const handleMemberChange = (e, index) => {
  //   console.log(e.target, "targettt===++++++++++++++++++++++++++++++++++");

  //   const { name, value } = e.target;
  //   // if (name == "customInstitute") {
  //   //   name = "institute";
  //   // }
  //   const updatedMembers = [...members];

  //   updatedMembers[index][name] = value;
  //   setMembers(updatedMembers);

  //   if (name == "mobile") {
  //     // console.log(name, "name");
  //     // console.log(numberVerified, "numberverifeddddddddd");
  //     // const newNumberVerifiedData = [...numberVerified];
  //     // console.log(newNumberVerifiedData, "newnumberverified");
  //     // newNumberVerifiedData[index].indexValue = index;
  //     // newNumberVerifiedData[index].mobile = e.target.value;
  //     // setnumberVerified(newNumberVerifiedData);
  //   }
  // };
  const handleMemberChange = (e, index) => {
    const { name, value } = e.target;
    const updatedMembers = [...members];

    // Create a new object for the specific member to avoid mutation
    updatedMembers[index] = {
      ...updatedMembers[index],
      [name]: value, // Update the specific field
    };

    setMembers(updatedMembers);
  };

  // Show additional fields when email is filled
  const handleEmailChange = (e, index) => {
    handleMemberChange(e, index);
    if (index === members.length - 1 && members.length < 3) {
      setMembers([
        ...members,
        {
          email: "",
          firstName: "",
          lastName: "",
          mobile: "",
          institute: "",
          customInstitute: "",
        },
      ]);
    }
  };
  // Update the `handleMemberChange` function to use a new object for each member

  // Add a new team member only if the previous member's details are filled out
  const addMember = () => {
    const lastMember = members[memberCount - 1];
    const isFilled =
      lastMember.email.trim() &&
      lastMember.firstName.trim() &&
      lastMember.lastName.trim() &&
      lastMember.mobile.trim() &&
      (lastMember.institute.trim() || lastMember.customInstitute.trim());

    if (isFilled && memberCount < 3) {
      setMemberCount(memberCount + 1);
    } else {
      alert(
        "Please fill out all fields for the current team member before adding a new one."
      );
    }
  };
  // const convertFileToBase64 = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = (error) => reject(error);
  //   });
  // };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const filledMembers = members.slice(0, memberCount);
    console.log(
      {
        teamCode,
        teamImage,
        members: filledMembers, // Submit only filled members
      },
      "data to submitttt"
    );

    const dataToSubmit = {
      teamCode,

      members: filledMembers, // Submit only filled members
    };
    if (dataToSubmit.teamCode == "") {
      alert("team code needed");
    }

    try {
      // Submit the form data to your backend endpoint
      if (dataToSubmit.teamCode !== "") {
        console.log("enterd====int form handler");

        if (teamCodeError) {
          alert("Team code is already taken. Please choose another one.");
        }
        if (!teamCodeError) {
          console.log(teamCodeError);
          setIsLoading(true);
          console.log("TEAM CODE ERRRROR");

          const response = await axios.post(
            `http://localhost:3000/events/registration/${eventId}`,
            dataToSubmit
          );

          // Handle successful response
          console.log(response, "resspose");

          console.log(
            "Form submitted successfully:",
            response.data,
            response.data.success
          );
          // Optionally, redirect the user or display a success message here
          setSuccessMessage(response.data.message);
          setErrorMessage(""); // Clear any previous error messages

          // Redirect to another page (e.g., "/success")
          if (response.data.success) {
            const updatedEmails = [...response.data.data];
            dispatch(addRegisteredData(updatedEmails));
            dispatch(storeMembers([]));
            dispatch(addTeamData({}));
            navigate("/success");
          }
        }
      }
    } catch (error) {
      setIsLoading(false);
      // Handle errors from the server

      console.log(error, "======>");

      console.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
      // Optionally, display an error message to the user

      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
      setSuccessMessage(""); // Clear any previous success messages
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyClick = async (index) => {
    if (members[index].mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return; // Prevent further execution if the mobile number is invalid
    }

    // Safe access to the member object
    const member = members[index];
    if (!member) {
      console.error("No member found at index:", index);
      return; // Early return if member does not exist
    }

    const email = member.email;
    const mobileNumber = member.mobile;

    try {
      const response = await axios.post(
        `http://localhost:3000/events/registration/${eventId}/verify-number`,
        { email, mobileNumber } // Replace with your actual endpoint
      );

      // Check if response is successful
      if (response.status === 200) {
        // Create a deep copy of members to avoid mutations
        const membersCopy = JSON.parse(JSON.stringify(members));

        // Update the specific member's verified status
        membersCopy[index] = { ...membersCopy[index], verified: true }; // Make sure to deep copy

        // Dispatch the copied state to the store
        dispatch(storeMembers(membersCopy));
        dispatch(addTeamData({ teamCode, teamImage, memberCount }));
        dispatch(addNumberVerifyData({ email, mobileNumber, index }));

        navigate(`/otp/${eventId}`);
      } else {
        console.error("Verification failed:", response.data);
        setError("Verification failed. Please try again.");
      }
    } catch (error) {
      console.log(error, "error otp page");

      if (error.response && error.response.data) {
        alert(error.response.data.message);
        // Handle backend error messages
        // setMobileError(
        //   error.response.data.message || "An error occurred. Please try again."
        // );
      } else {
        // Handle generic errors
        // setMobileError("An unexpected error occurred. Please try again.");
      }
    }
  };

  // const handleVerifyClick = async (index) => {
  //   if (members[index].mobile.length !== 10) {
  //     alert("Please enter a valid 10-digit mobile number.");
  //   }
  //   if (members[index].mobile.length == 10) {
  //     let base64Image = "";
  //     // if (teamImage) {
  //     //   base64Image = await convertFileToBase64(files);
  //     // }
  //     console.log(index, "butttoton");
  //     console.log(members[index].mobile, "mobilleee");
  //     const email = members[index].email;
  //     const mobileNumber = members[index].mobile;
  //     // const updatedMembers = [...members];
  //     // updatedMembers[index].verified = true;
  //     // members[index].verified = true;
  //     // setMembers(members);

  //     // localStorage.setItem("numbersVerified", JSON.stringify(numberVerified));
  //     //dispatch(addMobileVerificationData(verificationData));
  //     //api calll
  //     //navigate(`/otp/${eventId}`);
  //     try {
  //       //
  //       //Make the API call
  //       console.log("hello");

  //       const response = await axios.post(
  //         `http://localhost:3000/events/registration/${eventId}/verify-number`,
  //         { email, mobileNumber } // Replace with your actual endpoint
  //       );

  //       // Check the response to ensure it was successful
  //       //
  //       if (response.status === 200) {
  //         // If successful, navigate to OTP page
  //         const membersCopy = members.map((member) => ({
  //           ...member,
  //           // If you want to change something before dispatching
  //         }));

  //         // Dispatch the copied state to the store
  //         dispatch(storeMembers([...membersCopy]));
  //         dispatch(addTeamData({ teamCode, teamImage, memberCount }));
  //         dispatch(addNumberVerifyData({ email, mobileNumber, index }));
  //         navigate(`/otp/${eventId}`);
  //       } else {
  //         // Handle any other status codes that indicate failure
  //         console.error("Verification failed:", response.data);
  //         setError("Verification failed. Please try again.");
  //       }
  //     } catch (error) {
  //       console.log(error, "errror otp page");

  //       if (error.response && error.response.data) {
  //         // Set the mobile error message from the backend response
  //         // setMobileError(
  //         //   error.response.data.message ||
  //         //     "An error occurred. Please try again."
  //         // );
  //       } else {
  //         //setMobileError("An unexpected error occurred. Please try again.");
  //       }
  //     }
  //   }

  //   // Navigate to OTP Page
  //   //navigate("/otp");
  // };
  useEffect(() => {
    console.log(teamData, "teamData=============");
    ///nuberobject
    const numberObject = JSON.parse(localStorage.getItem("numbersVerified"));
    console.log(numberObject, "numberObject=====");

    setnumberVerified([numberObject]);

    // Populate local state with persisted Redux state if available
    if (teamData.teamCode) {
      setTeamCode(teamData.teamCode);
    }
    if (teamData.teamImage) {
      setTeamImage(teamData.teamImage);
    }
    console.log(teamData.teamImage, "Imageefilleeee========");

    if (teamMembers.length) {
      setMembers(teamMembers);
      setMemberCount(teamMembers.length); // Set the member count based on persisted data
    }

    const savedFile = localStorage.getItem("uploadedFile");
    if (savedFile) {
      console.log(savedFile, "=====saveeddImageeeeeeeeee========++++++=");
      console.log(JSON.parse(savedFile), "parsdeddddddd");

      // If a file was saved in sessionStorage, update the state
      setFiles(JSON.parse(savedFile)); // Parse it back to an object
      // Set the Base64 string for preview

      console.log(
        JSON.parse(localStorage.getItem("numbersVerified")),
        "0000000000000000"
      );
    }

    const fetchCollegeInfo = async () => {
      console.log("REGISTER cuhuihiialled");

      try {
        const response = await axios.get(
          "http://localhost:3000/events/registration/institute"
        );

        // Log the specific structure of data you expect
        console.log(response.data, "responseData");

        setInstituteInfo(response.data);
      } catch (err) {
        console.log(err);
        // Log the error for debugging
      }
    };

    fetchCollegeInfo();
  }, []);

  const checkTeamCodeAvailability = async () => {
    console.log("check");
    console.log(teamCode.trim());

    try {
      const response = await axios.post(
        `http://localhost:3000/events/registration/code/teamcode`,
        { teamCode: teamCode.trim() }
      );
      console.log(response, "respons");

      if (response.data.success) {
        console.log(response, "respons");

        setIsTeamCodeAvailable(true);
        setTeamCodeError(""); // Clear any previous error
      } else {
        setIsTeamCodeAvailable(false);
        setTeamCodeError(
          "Team code is already taken. Please choose another one."
        );
      }
    } catch (error) {
      console.error("Error checking team code availability:", error);

      if (error.response && error.response.data) {
        console.log("Error Response Data:", error.response.data); // Log the response data for debugging

        const errorMessage = error.response.data.message;

        console.log("Error Message:", errorMessage); // Log the extracted error message

        if (errorMessage === "This team code has already been taken") {
          setTeamCodeError(
            "The team code you entered is already in use. Please choose another one."
          );
        } else {
          setTeamCodeError(
            errorMessage ||
              "Unable to check team code availability. Please try again."
          );
        }
      } else if (error.request) {
        // No response from server
        console.error("No response from the server:", error.request); // Log request for debugging
        setTeamCodeError(
          "No response from the server. Please check your network connection or try again later."
        );
      } else {
        // General error message for unexpected errors
        console.error("Unexpected error:", error.message); // Log unexpected error message
        setTeamCodeError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen   flex items-center justify-center bg-black relative">
      {isLoading && (
        <div className="absolute inset-0 flex pt-96 items-center justify-center bg-black bg-opacity-50 z-50">
          <Triangle
            visible={true}
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="triangle-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      )}
      <div className="max-w-2xl w-full mx-auto p-8 bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Registration Form
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Code and Image Upload */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              {/* Team Image Preview (if available) */}
              <label htmlFor="teamImage" className="cursor-pointer">
                <span className="inline-block h-16 w-16 mt-5 rounded-full overflow-hidden bg-gray-700 text-gray-300 flex items-center justify-center">
                  {teamImage ? (
                    <img
                      src={teamImage} // Use the Base64 string here
                      alt="Team"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-md">U</span>
                  )}
                </span>
              </label>

              {/* Image Upload Input Field */}
              <input
                type="file"
                id="teamImage"
                name="teamImage"
                accept="image/*"
                onChange={handleImageChange} // Trigger Base64 conversion on file change
                className="hidden" // Hidden input; label serves as the upload button
              />
            </div>
            {/* Image Upload Field */}
            {/* <div className="flex items-center"> */}
            {/* <label htmlFor="teamImage" className="cursor-pointer"> */}
            {/* <span className="inline-block h-16 w-16 mt-5 rounded-full overflow-hidden bg-gray-700 text-gray-300 flex items-center justify-center">
                  {teamImage ? (
                    <img
                      src={URL.createObjectURL(teamImage)}
                      alt="Team"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-sm">U</span>
                  )}
                </span>
              </label> */}
            {/* <input
                type="file"
                id="teamImage"
                name="teamImage"
                onChange={handleImageChange}
                className=""
              /> */}
            {/* </div> */}
            {/* <div className="flex items-center">
              <input
                type="file"
                id="teamImage"
                name="teamImage"
                accept="image/*" // Ensures only image files are selectable
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-300 bg-gray-700 border border-gray-500 rounded-lg cursor-pointer focus:outline-none focus:border-blue-400" // Styling for input field
              />
            </div> */}

            {/* Team Code Field */}
            <div className="flex-1">
              <label
                htmlFor="teamCode"
                className="block text-sm font-medium text-gray-300"
              >
                Team Code
              </label>
              <input
                type="text"
                id="teamCode"
                name="teamCode"
                value={teamCode}
                onChange={handleCommonFieldChange}
                onBlur={checkTeamCodeAvailability}
                // Trigger check onBlur (when input loses focus)
                className={`mt-1 block w-full rounded-md bg-gray-800 text-white border-gray-500 shadow-sm focus:ring-0 focus:border-blue-400 sm:text-sm p-3 ${
                  !isTeamCodeAvailable ? "border-red-500" : ""
                }`} // Add red border if team code is taken
              />
              {!isTeamCodeAvailable && (
                <p className="text-red-500 text-sm mt-1">{teamCodeError}</p>
              )}
            </div>
          </div>

          {/* Team Members */}
          {members.slice(0, memberCount).map((member, index) => (
            <div key={index} className="space-y-4">
              {/* Team Member Header */}
              <h2 className="text-xl font-semibold text-gray-300">
                Team Member #{index + 1}
              </h2>

              {/* Email Field */}
              <div className="w-full">
                <label
                  htmlFor={`email-${index}`}
                  className="block text-sm font-medium text-gray-300"
                >
                  Email
                </label>
                <input
                  type="email"
                  id={`email-${index}`}
                  name="email"
                  value={member.email}
                  onChange={(e) => handleEmailChange(e, index)}
                  className="mt-1 block w-full rounded-md bg-gray-800 text-white border-gray-500 shadow-sm focus:ring-0 focus:border-blue-400 sm:text-sm p-3" // Adjusted padding for height and added focus styles
                />
              </div>

              {/* Additional Fields (shown if email is entered) */}
              {member.email.trim() && (
                <>
                  {/* First Name and Last Name Side by Side */}
                  <div className="flex space-x-6">
                    <div className="w-1/2">
                      <label
                        htmlFor={`firstName-${index}`}
                        className="block text-sm font-medium text-gray-300"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id={`firstName-${index}`}
                        name="firstName"
                        value={member.firstName}
                        onChange={(e) => handleMemberChange(e, index)}
                        className="mt-1 block w-full rounded-md bg-gray-800 text-white border-gray-500 shadow-sm focus:ring-0 focus:border-blue-400 sm:text-sm p-3" // Adjusted padding for height and added focus styles
                      />
                    </div>
                    <div className="w-1/2">
                      <label
                        htmlFor={`lastName-${index}`}
                        className="block text-sm font-medium text-gray-300"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id={`lastName-${index}`}
                        name="lastName"
                        value={member.lastName}
                        onChange={(e) => handleMemberChange(e, index)}
                        className="mt-1 block w-full rounded-md bg-gray-800 text-white border-gray-500 shadow-sm focus:ring-0 focus:border-blue-400 sm:text-sm p-3" // Adjusted padding for height and added focus styles
                      />
                    </div>
                  </div>

                  {/* Institute (Dropdown with Custom Option) */}
                  <div>
                    <label
                      htmlFor={`institute-${index}`}
                      className="block text-sm font-medium text-gray-300"
                    >
                      Institute
                    </label>
                    <select
                      id={`institute-${index}`}
                      name="institute"
                      value={member.institute}
                      onChange={(e) => {
                        handleMemberChange(e, index);
                        // Clear customInstitute if a predefined option is selected
                        if (e.target.value) {
                          setMembers((prevMembers) => {
                            const updated = [...prevMembers];
                            updated[index].customInstitute = ""; // Clear custom entry
                            return updated;
                          });
                        }
                      }}
                      className="mt-1 block w-full rounded-md bg-gray-800 text-white border-gray-500 shadow-sm focus:ring-0 focus:border-blue-400 sm:text-sm p-3"
                    >
                      <option value="">Select Institute</option>
                      {instituteInfo.map((institute) => {
                        return (
                          <option value={institute.name}>
                            {institute.name}
                          </option>
                        );
                      })}

                      <option value="other">Other</option>
                    </select>
                    {member.institute === "other" && (
                      <div className="mt-2">
                        <label
                          htmlFor={`customInstitute-${index}`}
                          className="block text-sm font-medium text-gray-300"
                        >
                          Enter Your Institute Name
                        </label>
                        <input
                          type="text"
                          id={`customInstitute-${index}`}
                          name="customInstitute"
                          value={member.customInstitute}
                          onChange={(e) => handleMemberChange(e, index)}
                          className="mt-1 block w-full rounded-md bg-gray-800 text-white border-gray-500 shadow-sm focus:ring-0 focus:border-blue-400 sm:text-sm p-3"
                        />
                      </div>
                    )}
                  </div>

                  {/* Mobile Number with Verify Button */}
                  <div className="relative">
                    <label
                      htmlFor={`mobile-${index}`}
                      className="block text-sm font-medium text-gray-300"
                    >
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      id={`mobile-${index}`}
                      name="mobile"
                      value={member.mobile}
                      onChange={(e) => handleMemberChange(e, index)}
                      className="mt-1 block w-full rounded-md bg-gray-800 text-white border-gray-500 shadow-sm focus:ring-0 focus:border-blue-400 sm:text-sm p-3 pr-20"
                    />
                    {/* Verify Button */}
                    {member.mobile.trim().length >= 10 && (
                      <button
                        type="button"
                        className={`absolute inset-y-0 right-3 mt-11 flex items-center justify-center w-12 h-8 text-sm text-white rounded-full ${
                          member.verified
                            ? " cursor-not-allowed"
                            : "bg-green-600"
                        }`}
                        style={{ transform: "translateY(-50%)" }}
                        onClick={() => handleVerifyClick(index)}
                        id={`verify-${index}`}
                        disabled={member.verified} // Disable button if verified
                      >
                        {/* Show the FaCheckCircle icon if verified, else show 'Verify' text */}
                        {member.verified ? (
                          <FaCheckCircle className="text-green-500 " />
                        ) : (
                          "Verify"
                        )}
                      </button>
                    )}

                    {/* Error Message for Mobile Verification */}
                    {mobileError && (
                      <p className="mt-2 text-sm text-red-600">{mobileError}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Add Member Button */}
          {memberCount < 3 && (
            <button
              type="button"
              onClick={addMember}
              className={`mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                memberCount < 3
                  ? "text-white bg-orange-600 hover:bg-orange-500"
                  : "bg-gray-400 cursor-not-allowed"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400`}
              disabled={memberCount >= 3}
            >
              + Add Member ({3 - memberCount})
            </button>
          )}

          {/* Register Team Button (Visible after filling out details for all members) */}
          {/* Register Team Button (Visible after filling out details for at least two members) */}
          {memberCount >= 2 &&
            members
              .slice(0, memberCount)
              .every(
                (member) =>
                  member.email.trim() &&
                  member.firstName.trim() &&
                  member.lastName.trim() &&
                  member.mobile.trim() &&
                  (member.institute.trim() || member.customInstitute.trim())
              ) && (
              <button
                type="submit"
                className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Register Team
              </button>
            )}
        </form>
        {/* Display error message under the form */}
        {errorMessage && (
          <div className="error-message text-red-500 text-sm mt-1">
            {errorMessage}
          </div>
        )}
      </div>
      {/* <div>
        {teamImageBase64 ? (
          <img
            src={teamImageBase64}
            alt="Team Preview"
            style={{ width: "200px", height: "200px", borderRadius: "50%" }}
          />
        ) : (
          <p>No team image available</p>
        )}
      </div> */}
    </div>
  );
};

export default TeamRegistration;
