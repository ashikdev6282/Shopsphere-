// src/redux/productSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // All products (array of { id, ...fields })
  selectedProduct: null, // Currently selected for editing/viewing
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // Replace entire list (used after full fetch)
    setProducts: (state, action) => {
      state.items = action.payload || [];
    },

    // Add new product (local-only)
    addProduct: (state, action) => {
      state.items.push(action.payload);
    },

    // Update existing product (local-only) — expects payload to include id
    updateProduct: (state, action) => {
      const updated = action.payload;
      state.items = state.items.map((item) =>
        item.id === updated.id ? { ...item, ...updated } : item
      );
    },

    // Upsert single product: create if not exists, update if exists
    upsertProduct: (state, action) => {
      const p = action.payload;
      const idx = state.items.findIndex((it) => it.id === p.id);
      if (idx === -1) {
        state.items.push(p);
      } else {
        state.items[idx] = { ...state.items[idx], ...p };
      }
    },

    // Delete a product by id
    deleteProduct: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
    },

    // Toggle product availability (accepts either id or { id, active })
    toggleProductStatus: (state, action) => {
      const payload = action.payload;
      let id;
      let newActive;
      if (typeof payload === "object" && payload !== null) {
        id = payload.id;
        newActive = payload.active;
      } else {
        id = payload;
      }
      const product = state.items.find((item) => item.id === id);
      if (product) {
        // if caller provided explicit active value, use it; otherwise flip
        product.active = typeof newActive === "boolean" ? newActive : !product.active;
      }
    },

    // Select single product into selectedProduct
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },

    // Clear selection
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },

    // Replace single product (useful if you fetched one doc)
    setProduct: (state, action) => {
      const p = action.payload;
      if (!p || !p.id) return;
      const idx = state.items.findIndex((it) => it.id === p.id);
      if (idx === -1) state.items.push(p);
      else state.items[idx] = p;
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  upsertProduct,
  deleteProduct,
  toggleProductStatus,
  setSelectedProduct,
  clearSelectedProduct,
  setProduct,
} = productSlice.actions;

export default productSlice.reducer;

/**
 * Selectors (convenience)
 */
export const selectAllProducts = (state) => state.product.items || [];
export const selectProductById = (state, id) =>
  (state.product.items || []).find((p) => p.id === id) ?? null;
export const selectSelectedProduct = (state) => state.product.selectedProduct ?? null;
