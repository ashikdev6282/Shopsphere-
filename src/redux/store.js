import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../redux/cartSlice.jsx';
import productReducer from '../redux/productSlice.jsx';
import userReducer from '../redux/userSlice.jsx';
import checkoutReducer from '../redux/checkoutSlice.jsx';
import authReducer from '../redux/authSlice.jsx';
import themeReducer from '../redux/themeSlice.jsx';
import orderReducer from '../redux/orderSlice.jsx';
import customerReducer from '../redux/customerSlice.jsx';
import { User } from 'lucide-react';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    product: productReducer,
    user: userReducer,
    checkout: checkoutReducer,
    auth: authReducer,
    theme: themeReducer,
    orders: orderReducer,
    customers: customerReducer,
  },
});
export default store;
