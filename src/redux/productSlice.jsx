import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // All products
  selectedProduct: null, // Currently selected for editing/viewing
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // Load products
    setProducts: (state, action) => {
      state.items = action.payload;
    },

    // Add new product
    addProduct: (state, action) => {
      state.items.push(action.payload);
    },

    // Update existing product
    updateProduct: (state, action) => {
      const updated = action.payload;
      state.items = state.items.map((item) =>
        item.id === updated.id ? updated : item
      );
    },

    // Delete a product
    deleteProduct: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    // Toggle product availability (Active/Inactive)
    toggleProductStatus: (state, action) => {
      const id = action.payload;
      const product = state.items.find((item) => item.id === id);
      if (product) product.active = !product.active;
    },

    // Select / clear selection
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  setSelectedProduct,
  clearSelectedProduct,
} = productSlice.actions;

export default productSlice.reducer;
