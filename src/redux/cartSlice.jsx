import { createSlice } from "@reduxjs/toolkit";

/* ================================
   🔹 localStorage helpers
================================ */
const loadCart = () => {
  try {
    const data = localStorage.getItem("cart");
    return data
      ? JSON.parse(data)
      : { items: [], totalQuantity: 0, totalPrice: 0 };
  } catch {
    return { items: [], totalQuantity: 0, totalPrice: 0 };
  }
};

const saveCart = (state) => {
  localStorage.setItem(
    "cart",
    JSON.stringify({
      items: state.items,
      totalQuantity: state.totalQuantity,
      totalPrice: state.totalPrice,
    })
  );
};

/* ================================
   🔹 initial state (hydrated)
================================ */
const initialState = {
  ...loadCart(),
  loading: false, // for skeleton loader
};

/* ================================
   🔹 cart slice
================================ */
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /* ---------- ADD ---------- */
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find((i) => i.id === item.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }

      state.totalQuantity += 1;
      state.totalPrice += Number(item.price || 0);

      saveCart(state);
    },

    /* ---------- REMOVE ---------- */
    removeFromCart: (state, action) => {
      const id = action.payload;
      const item = state.items.find((i) => i.id === id);

      if (item) {
        state.totalQuantity -= item.quantity;
        state.totalPrice -= item.price * item.quantity;
        state.items = state.items.filter((i) => i.id !== id);
      }

      saveCart(state);
    },

    /* ---------- INCREASE ---------- */
    increaseQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find((i) => i.id === id);

      if (item) {
        item.quantity += 1;
        state.totalQuantity += 1;
        state.totalPrice += item.price;
      }

      saveCart(state);
    },

    /* ---------- DECREASE ---------- */
    decreaseQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find((i) => i.id === id);

      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.totalQuantity -= 1;
        state.totalPrice -= item.price;
      }

      saveCart(state);
    },

    /* ---------- SET EXACT QTY ---------- */
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);

      if (item && quantity > 0) {
        const diff = quantity - item.quantity;
        item.quantity = quantity;

        state.totalQuantity += diff;
        state.totalPrice += item.price * diff;
      }

      saveCart(state);
    },

    /* ---------- CLEAR CART ---------- */
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      localStorage.removeItem("cart");
    },

    /* ---------- LOADING ---------- */
    setCartLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  updateQuantity,
  clearCart,
  setCartLoading,
} = cartSlice.actions;

export default cartSlice.reducer;
