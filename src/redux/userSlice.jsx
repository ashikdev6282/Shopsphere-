import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    id: 1,
    name: "Ashik T.N",
    email: "ashik@example.com",
    phone: "+91 9876543210",
    address: "Thrissur, Kerala, India",
    avatar: "https://i.pravatar.cc/150?img=32", // default profile avatar
    orders: 12,
    wishlist: 5,
    joined: "March 2024",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { updateUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
