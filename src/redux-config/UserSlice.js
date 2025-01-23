import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "UserSlice",
  initialState: {
    user: {},
    token: null,
    message: "",
    isLoggedIn: false, // Added this field
  },
  reducers: {
    setUser: (state, action) => {
      console.log(action.payload); // Debug log
      state.message = action.payload.message;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isLoggedIn = true; // Set isLoggedIn to true
      delete state.user.password; // Remove sensitive password data
    },
    signOut: (state) => {
      state.user = {};
      state.token = null;
      state.message = "";
      state.isLoggedIn = false; // Set isLoggedIn to false on sign out
    },
  },
});

export const { setUser, signOut } = slice.actions;
export default slice.reducer;

 