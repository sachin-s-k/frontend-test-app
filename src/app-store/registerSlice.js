import { createSlice } from "@reduxjs/toolkit";

const registerSlice = createSlice({
  name: "register",
  initialState: {
    membersData: [],
    teamData: {},
    numberVerifyData: {},
    registeredData: [],
    verificationPhoneData: {},
  },
  reducers: {
    storeMembers: (state, action) => {
      state.membersData = [...action.payload];
    },
    addTeamData: (state, action) => {
      state.teamData = action.payload;
    },
    addNumberVerifyData: (state, action) => {
      state.numberVerifyData = action.payload;
    },
    addRegisteredData: (state, action) => {
      console.log("register successfull etnterd store");

      state.registeredData = [...action.payload];
    },
    addMobileVerificationData: (state, action) => {
      state.verificationPhoneData = action.payload;
    },
  },
});
export const {
  storeMembers,
  addTeamData,
  addNumberVerifyData,
  addRegisteredData,
  addMobileVerificationData,
} = registerSlice.actions;
export default registerSlice.reducer;
