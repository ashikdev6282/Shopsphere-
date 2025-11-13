import { useState } from 'react'
import './App.css'
import { Route, Router, Routes, useLocation } from 'react-router-dom'
import Header from './components/layout/header'
import Home from './pages/LandingPage'
import Footer from './components/layout/Footer'
import ProductsPage from './pages/ProductsPage'
import 'aos/dist/aos.css';
import AOS from 'aos';
import HomePage from './pages/HomePage'
import About from './pages/AboutSection'
import Contact from './pages/ContactSection'
import CartPage from './pages/CartSection'
import ProfileSection from './pages/ProfileSection'
import CheckoutPage from './pages/CheckoutPage'
import ProductDetailsPage from './pages/ProductDetailpage'
import ProtectedRoute from './routes/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminRoute from './Admin/routes/AdminRoutes'
import AdminLayout from './Admin/layout/AdminLayout'
import AdminDashboard from './Admin/pages/Dashboard'
import { Toaster } from 'react-hot-toast';
import AdminProducts from './Admin/pages/AdminProduct'
import AdminOrders from './Admin/pages/AdminOrders'
import AdminCustomers from './Admin/pages/AdminCustomer'
import UserSupportChat from './components/UserSupportChat'
import AdminSettings from './Admin/pages/AdminSettings'
AOS.init();


function App() {
  const dummyUser = { id: 1, name: "John Doe" };
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  return (
    <>
      {!isAdminRoute && <Header />}
        <Routes>
          
           {/* Public routes */}{/* User routes */}
          <Route path="/" element={<Home />} />
          <Route path='/products/:id' element={<ProductDetailsPage />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/products' element={<ProductsPage />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/checkout' element={<CheckoutPage />} />
          <Route path='/profile' element={<ProfileSection />} />
          <Route path='/homepage' element={<HomePage />} />
         

          {/*  Protected routes */}{/* User routes */}
          
          

          
          {/* Admin routes */}
           <Route path="/admin/*" element={<AdminRoute><AdminLayout /></AdminRoute>}>
           <Route index element={<AdminDashboard />} />
           <Route path="adminproduct" element={<AdminProducts />} />
           <Route path="adminorder" element={<AdminOrders />} />
           <Route path='customers' element={<AdminCustomers />} />
           <Route path='settings' element={<AdminSettings />} />
           </Route>
        </Routes>

      {!isAdminRoute && ( 
        <>
          <Footer />
          <UserSupportChat user={dummyUser} /> 
       </>
      )}
      <Toaster position="top-right" reverseOrder={false} />
    </> 
  )
}

export default App
