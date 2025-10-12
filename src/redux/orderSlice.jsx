import { createSlice } from "@reduxjs/toolkit";
import { dummyOrders } from "../Admin/components/dummyorders";

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    items: dummyOrders,
    selectedOrder: null,
  },
  reducers: {
    setOrders: (state, action) => { state.items = action.payload },
    setSelectedOrder: (state, action) => { state.selectedOrder = action.payload },
    clearSelectedOrder: (state) => { state.selectedOrder = null },
    updateOrderStatus: (state, action) => {
      const { id, status } = action.payload;
      const order = state.items.find(o => o.id === id);
      if (order) order.status = status;
    },
    deleteOrder: (state, action) => {
      state.items = state.items.filter(o => o.id !== action.payload);
    },
  }
});

export const { setOrders, setSelectedOrder, clearSelectedOrder, updateOrderStatus, deleteOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
