// src/redux/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,          // full user object (from Firestore)
  isAuthenticated: false,         
  loading: true,       // used while Firebase checks auth state
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Called by Firebase Auth Listener in App.jsx
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },

    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
