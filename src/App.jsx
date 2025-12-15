// src/App.jsx
import { useEffect } from "react";
import "./App.css";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";

/* Layout */
import Header from "./components/layout/header";
import Footer from "./components/layout/Footer";
import UserSupportChat from "./components/UserSupportChat";

/* Pages */
import Home from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailpage";
import About from "./pages/AboutSection";
import Contact from "./pages/ContactSection";
import CartPage from "./pages/CartSection";
import CheckoutPage from "./pages/CheckoutPage";
import ProfileSection from "./pages/ProfileSection";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import Wishlist from "./pages/Wishlist";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

/* Routes */
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminProtectedRoute from "./Admin/routes/AdminProtectedRoute";

/* Admin */
import AdminLayout from "./Admin/layout/AdminLayout";
import AdminDashboard from "./Admin/pages/Dashboard";
import AdminProducts from "./Admin/pages/AdminProduct";
import AdminOrders from "./Admin/pages/AdminOrders";
import AdminCustomers from "./Admin/pages/AdminCustomer";
import AdminSettings from "./Admin/pages/AdminSettings";
import AdminProductsQA from "./Admin/pages/AdminProductQA";

/* Toast */
import { Toaster } from "react-hot-toast";

/* Firebase */
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase/firebase_config";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { fetchWishlistFS } from "./firebase/services/wishlistService";

/* Redux */
import { useDispatch } from "react-redux";
import { setUser, clearUser, setLoading } from "./redux/authSlice";
import {
  setWishlist,
  clearWishlist,
  setWishlistLoading,
} from "./redux/wishlistSlice";

/* Animations */
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init();

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  /* 🔐 AUTH STATE LISTENER (REFRESH SAFE) */
  useEffect(() => {
    dispatch(setLoading(true));

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          dispatch(clearUser());
          dispatch(clearWishlist()); // 🧹 clear wishlist on logout
          return;
        }

        const userRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          const isAdminEmail = firebaseUser.email === "admin@site.com";

          await setDoc(userRef, {
            name: firebaseUser.displayName || "",
            email: firebaseUser.email,
            avatar: firebaseUser.photoURL || "",
            role: isAdminEmail ? "admin" : "user",
            provider: firebaseUser.providerData[0]?.providerId || "password",
            createdAt: serverTimestamp(),
          });
        }

        const finalSnap = await getDoc(userRef);
        const data = finalSnap.data() || {};

        // ✅ 1️⃣ SET USER
        dispatch(
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: data.name || "",
            avatar: data.avatar || "",
            role: (data.role || "user").trim(),
            provider: data.provider || "password",
            createdAt: data.createdAt ? data.createdAt.toMillis() : null,
          })
        );

        // ✅ 2️⃣ FETCH + SET WISHLIST
        if ((data.role || "user") === "user") {
          dispatch(setWishlistLoading(true));
          const wishlist = await fetchWishlistFS(firebaseUser.uid);

          const safeWishlist = wishlist.map((item) => ({
            ...item,
            createdAt: item.createdAt?.toMillis?.() || null,
            updatedAt: item.updatedAt?.toMillis?.() || null,
          }));

          dispatch(setWishlist(safeWishlist));
        }
      } catch (error) {
        console.error("Auth listener error:", error);
        dispatch(clearUser());
        dispatch(clearWishlist());
      } finally {
        dispatch(setLoading(false));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <>
      {/* Hide header on admin routes */}
      {!isAdminRoute && <Header />}

      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/wishlist" element={<Wishlist />} />

        {/* ================= USER PROTECTED ================= */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileSection />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order/:orderId"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="adminproduct" element={<AdminProducts />} />
          <Route path="adminorder" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="productsQA" element={<AdminProductsQA />} />
        </Route>
      </Routes>

      {/* Footer + Chat only for users */}
      {!isAdminRoute && (
        <>
          <Footer />
          <UserSupportChat />
        </>
      )}

      <Toaster position="top-right" />
    </>
  );
}

export default App;
