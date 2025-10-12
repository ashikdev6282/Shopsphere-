import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, 
  isAuthenticated: false,
  role: null, 
  // Pre-seeded admin account
  adminAccount: {
    email: "admin@site.com",
    password: "admin123",
    role: "admin",
    name: "Super Admin",
  },
  // --- New fields for OTP signup ---
  registrationStep: 1, // 1 = fill form, 2 = OTP verification
  otpSent: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // --- Existing reducers ---
    register: (state, action) => {
      const { name, email, password } = action.payload;
      state.user = { name, email, password, role: "user" }; // default role = user
      state.isAuthenticated = true;
      state.role = "user";
    },
    login: (state, action) => {
      const { email, password } = action.payload;

      if (
        state.adminAccount.email === email &&
        state.adminAccount.password === password
      ) {
        state.user = { ...state.adminAccount };
        state.isAuthenticated = true;
        state.role = "admin";
        return;
      }

      if (
        state.user &&
        state.user.email === email &&
        state.user.password === password
      ) {
        state.isAuthenticated = true;
        state.role = "user";
      } else {
        alert("Invalid email or password ❌");
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
      state.registrationStep = 1;
      state.otpSent = "";
    },

    // --- New reducers for OTP signup ---
    setUserData: (state, action) => {
      // Can include phone number here
      state.user = { ...action.payload, role: "user" };
    },
    sendOtp: (state, action) => {
      state.otpSent = action.payload;
      state.registrationStep = 2;
    },
    verifyOtp: (state, action) => {
      if (action.payload === state.otpSent) {
        state.isAuthenticated = true;
        state.registrationStep = 3; // registration complete
        state.otpSent = "";
        state.role = "user";
      }
    },
    setRegistrationStep: (state, action) => {
      state.registrationStep = action.payload;
    },
  },
});

// Export all actions
export const {
  register,
  login,
  logout,
  setUserData,
  sendOtp,
  verifyOtp,
  setRegistrationStep,
} = authSlice.actions;

export default authSlice.reducer;
