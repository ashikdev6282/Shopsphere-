import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customers: [
    {
      id: 1,
      name: "Aarav Patel",
      email: "aarav.patel@example.com",
      phone: "+91 9876543210",
      location: "Mumbai, India",
      totalOrders: 12,
      totalSpent: 1580,
      joinedDate: "2024-06-15",
      status: "Active",
    },
    {
      id: 2,
      name: "Sophia Sharma",
      email: "sophia.sharma@example.com",
      phone: "+91 9988776655",
      location: "Bangalore, India",
      totalOrders: 8,
      totalSpent: 980,
      joinedDate: "2024-07-02",
      status: "Active",
    },
    {
      id: 3,
      name: "Rohan Verma",
      email: "rohan.verma@example.com",
      phone: "+91 8877665544",
      location: "Delhi, India",
      totalOrders: 4,
      totalSpent: 420,
      joinedDate: "2024-08-10",
      status: "Blocked",
    },
  ],
};

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    addCustomer: (state, action) => {
      const newCustomer = { id: Date.now(), ...action.payload };
      state.customers.push(newCustomer);
    },
    updateCustomer: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.customers.findIndex((c) => c.id === id);
      if (index !== -1) {
        state.customers[index] = { ...state.customers[index], ...updatedData };
      }
    },
    deleteCustomer: (state, action) => {
      state.customers = state.customers.filter((c) => c.id !== action.payload);
    },
    toggleCustomerStatus: (state, action) => {
      const id = action.payload;
      const customer = state.customers.find((c) => c.id === id);
      if (customer) {
        customer.status = customer.status === "Active" ? "Blocked" : "Active";
      }
    },
  },
});

export const { addCustomer, updateCustomer, deleteCustomer, toggleCustomerStatus } =
  customerSlice.actions;

export default customerSlice.reducer;
