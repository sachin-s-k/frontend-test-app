import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addTeamData, storeMembers } from "./app-store/registerSlice";
const TeamRegistration = () => {
  const teamMembers = useSelector((state) => state.registration.membersData);
  const teamData = useSelector((state) => state.registration.teamData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // State for common team fields
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
    },
  ]);

  // State to track the number of members added
  const [memberCount, setMemberCount] = useState(1);

  // Handle change for common team fields
  const handleCommonFieldChange = (e) => {
    setTeamCode(e.target.value);
  };

  // Handle image upload for team
  const handleImageChange = (e) => {
    setTeamImage(e.target.files[0]);
  };

  // Handle change for team member fields
  const handleMemberChange = (e, index) => {
    const { name, value } = e.target;
    const updatedMembers = [...members];
    updatedMembers[index][name] = value;
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const filledMembers = members.slice(0, memberCount);
    console.log({
      teamCode,
      teamImage,
      members: filledMembers, // Submit only filled members
    });
  };

  const handleVerifyClick = (index) => {
    console.log(index, "butttoton");
    console.log(members[index].mobile, "mobilleee");
    dispatch(storeMembers(members));
    dispatch(addTeamData({ teamCode, teamImage, memberCount }));

    // Navigate to OTP Page
    navigate("/otp");
  };
  // useEffect(() => {
  //   // Populate local state with persisted Redux state if available
  //   if (teamData.teamCode) {
  //     setTeamCode(teamData.teamCode);
  //   }
  //   if (teamData.teamImage) {
  //     setTeamImage(teamData.teamImage);
  //   }
  //   if (teamMembers.length) {
  //     setMembers(teamMembers);
  //     setMemberCount(teamMembers.length); // Set the member count based on persisted data
  //   }
  // }, [teamData, teamMembers]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-2xl w-full mx-auto p-8 bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Team Registration Form
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Code and Image Upload */}
          <div className="flex items-center space-x-6">
            {/* Image Upload Field */}
            <div className="flex items-center">
              <label htmlFor="teamImage" className="cursor-pointer">
                <span className="inline-block h-16 w-16 mt-5 rounded-full overflow-hidden bg-gray-700 text-gray-300 flex items-center justify-center">
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
              </label>
              <input
                type="file"
                id="teamImage"
                name="teamImage"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

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
                className="mt-1 block w-full rounded-md bg-gray-800 text-white border-gray-500 shadow-sm focus:ring-0 focus:border-blue-400 sm:text-sm p-3" // Adjusted padding for height and added focus styles
              />
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
                      <option value="Institute A">Institute A</option>
                      <option value="Institute B">Institute B</option>
                      <option value="Institute C">Institute C</option>
                      <option value="other">Other</option>
                    </select>
                    {member.institute === "other" && (
                      <div className="mt-2">
                        <label
                          htmlFor={`customInstitute-${index}`}
                          className="block text-sm font-medium text-gray-300"
                        >
                          Enter Custom Institute Name
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
                      className="mt-1 block w-full rounded-md bg-gray-800 text-white border-gray-500 shadow-sm focus:ring-0 focus:border-blue-400 sm:text-sm p-3 pr-20" // Adjusted padding for height and added focus styles
                    />
                    {/* Verify Button */}
                    {member.mobile.trim().length >= 10 && (
                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 mt-11 flex items-center justify-center w-12 h-8 bg-green-600 text-white rounded-full"
                        style={{ transform: "translateY(-50%)" }} // Centering the button vertically
                        onClick={(e) => {
                          handleVerifyClick(index);
                        }}
                        id={`verify-${index}`}
                      >
                        Verify
                      </button>
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
          {memberCount === 3 &&
            members.every(
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
      </div>
    </div>
  );
};

export default TeamRegistration;
