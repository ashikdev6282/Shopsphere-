import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    setReviews: (state, action) => {
      state.items = action.payload;
      state.loading = false;
    },

    addReview: (state, action) => {
      state.items.unshift(action.payload);
    },

    removeReview: (state, action) => {
      state.items = state.items.filter(
        (r) => r.id !== action.payload
      );
    },

    clearReviews: (state) => {
      state.items = [];
      state.loading = false;
    },

    setReviewLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setReviews,
  addReview,
  removeReview,
  clearReviews,
  setReviewLoading,
} = reviewSlice.actions;

export default reviewSlice.reducer;
