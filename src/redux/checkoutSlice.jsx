import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sameAsBilling: false,
  paymentMethod: "razorpay", // "cod" or "razorpay"
  billing: {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
  },
  shipping: {
    fullName: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
  },
  deliveryOption: "standard", // "standard" or "express"
  orderSummary: {
    items: [],
    subtotal: 0,
    shipping: 0,
    total: 0,
  },
  buyNowItem: null, // for Buy Now flow
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setSameAsBilling(state, action) {
      state.sameAsBilling = action.payload;
    },
    setPaymentMethod(state, action) {
      state.paymentMethod = action.payload;
    },

    // ✅ Merge updates (don’t overwrite whole object)
    updateBilling(state, action) {
      state.billing = { ...state.billing, ...action.payload };
    },
    updateShipping(state, action) {
      state.shipping = { ...state.shipping, ...action.payload };
    },

    setDeliveryOption(state, action) {
      state.deliveryOption = action.payload;
    },
    setDeliveryMethod(state, action) {
      state.deliveryMethod = action.payload;
    },

    setOrderSummary(state, action) {
      state.orderSummary = action.payload;
    },

    // ✅ Buy Now logic
    setBuyNowItem(state, action) {
      state.buyNowItem = action.payload;
    },
    clearBuyNowItem(state) {
      state.buyNowItem = null;
    },

    // ✅ Set checkout items (cart or buy now)
    setCheckoutItems(state, action) {
      state.orderSummary.items = action.payload;

      const subtotal = action.payload.reduce(
        (sum, item) => sum + item.price * (item.quantity || item.qty || 1),
        0
      );

      state.orderSummary.subtotal = subtotal;
      state.orderSummary.total = subtotal + state.orderSummary.shipping;
    },

    // ✅ Full reset
    resetCheckout(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setSameAsBilling,
  setPaymentMethod,
  updateBilling,
  updateShipping,
  setDeliveryMethod,
  resetCheckout,
  setDeliveryOption,
  setOrderSummary,
  setBuyNowItem,
  clearBuyNowItem,
  setCheckoutItems,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
