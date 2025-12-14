import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: true,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // ✅ Called after Firestore fetch
    setWishlist: (state, action) => {
      state.items = action.payload;
      state.loading = false; // ✅ FIXED
    },

    // ✅ Toggle wishlist item (UI + Firestore sync)
    toggleWishlist: (state, action) => {
      const exists = state.items.some(
        (item) => String(item.id) === String(action.payload.id)
      );

      if (exists) {
        state.items = state.items.filter(
          (item) => String(item.id) !== String(action.payload.id)
        );
      } else {
        // ✅ ENSURE SERIALIZABLE DATA
        state.items.push({
          ...action.payload,
          createdAt:
            typeof action.payload.createdAt === "number"
              ? action.payload.createdAt
              : null,
        });
      }
    },

    addWishlistItem: (state, action) => {
      const exists = state.items.some(
        (item) => String(item.id) === String(action.payload.id)
      );
      if (!exists) {
        state.items.push({
          ...action.payload,
          createdAt:
            typeof action.payload.createdAt === "number"
              ? action.payload.createdAt
              : null,
        });
      }
    },

    removeWishlistItem: (state, action) => {
      state.items = state.items.filter(
        (item) => String(item.id) !== String(action.payload)
      );
    },

    // ✅ On logout
    clearWishlist: (state) => {
      state.items = [];
      state.loading = false; // ✅ FIXED
    },

    setWishlistLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setWishlist,
  addWishlistItem,
  removeWishlistItem,
  clearWishlist,
  setWishlistLoading,
  toggleWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
