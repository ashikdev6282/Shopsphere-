// src/pages/CheckoutPage.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSameAsBilling, setPaymentMethod, updateBilling, updateShipping, setBuyNowItem, } from "../redux/checkoutSlice";
import { clearCart } from "../redux/cartSlice"; // assumes you have this action
import { CheckCircle2 } from "lucide-react";
import Confetti from "react-confetti";
import toast from "react-hot-toast";
import { createOrder } from "../firebase/services/orderService";
import { auth } from "../firebase/firebase_config";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const {
    sameAsBilling,
    paymentMethod,
    billing,
    shipping,
    buyNowItem,
  } = useSelector((state) => state.checkout);
  const cartItems = useSelector((state) => state.cart.items || []);

  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Restore buyNowItem from localStorage if missing
  useEffect(() => {
    const savedBuyNow = localStorage.getItem("buyNowData");
    if (!buyNowItem && savedBuyNow) {
      try {
        dispatch(setBuyNowItem(JSON.parse(savedBuyNow)));
      } catch (err) {
        console.warn("Invalid buyNowData in localStorage", err);
      }
    }
  }, [buyNowItem, dispatch]);

  // Choose items: BuyNow or Cart
  const items = buyNowItem ? [buyNowItem] : cartItems;

  // Calculate order summary dynamically
  const orderSummary = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * (item.quantity || item.qty || 1),
      0
    );
    const shippingCost = subtotal > 100 ? 0 : 10;
    return {
      items,
      subtotal,
      shippingCost,
      total: subtotal + shippingCost,
    };
  }, [items]);

  // Load Razorpay SDK if needed
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // create order in Firestore
  const placeOrderToFirestore = async (opts) => {
    const user = auth.currentUser;
    const orderPayload = {
      userId: user?.uid || "guest",
      customerName: (sameAsBilling ? billing.fullName : shipping.fullName) || billing.fullName || "Guest",
      customerEmail: billing.email || null,
      customerPhone: billing.phone || shipping.phone || null,
      status: opts?.status || "Pending",
      paymentStatus: opts?.paymentStatus || "Pending",
      paymentMethod: paymentMethod || "cod",
      paymentId: opts?.paymentId || null,
      totalAmount: orderSummary.total,
      items: orderSummary.items.map((it) => ({
        productId: it.id || it.productId || null,
        name: it.name,
        price: it.price,
        quantity: it.quantity || it.qty || 1,
      })),
      shippingAddress: {
        fullName: sameAsBilling ? billing.fullName : shipping.fullName,
        phone: sameAsBilling ? billing.phone : shipping.phone,
        address: sameAsBilling ? billing.address : shipping.address,
        city: sameAsBilling ? billing.city : shipping.city,
        zip: sameAsBilling ? billing.zip : shipping.zip,
      },
      createdAt: new Date().toISOString(), // orderService will set serverTimestamp as well, but keep readable client timestamp
    };

    const orderId = await createOrder(orderPayload);
    return orderId;
  };

  // Razorpay Payment Handler
  const handleRazorpayPayment = async () => {
    setLoading(true);
    const ok = await loadRazorpayScript();
    if (!ok) {
      setLoading(false);
      toast.error("Failed to load payment gateway. Try again.");
      return;
    }

    const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_xxxxxxxx";

    const options = {
      key: RAZORPAY_KEY,
      amount: Math.round(orderSummary.total * 100), // paise
      currency: "INR",
      name: "ShopSphere",
      description: "Order Payment",
      handler: async function (response) {
        // response.razorpay_payment_id etc.
        try {
          // create order with payment marked as Paid
          await placeOrderToFirestore({
            status: "Processing",
            paymentStatus: "Paid",
            paymentId: response.razorpay_payment_id,
          });

          // clear cart / buyNow
          dispatch(clearCart());
          dispatch(setBuyNowItem(null));
          localStorage.removeItem("buyNowData");

          toast.success("Payment successful — order placed 🎉");
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 5000);
        } catch (err) {
          console.error("Error saving order after payment:", err);
          toast.error("Payment succeeded but saving order failed. Contact support.");
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: billing.fullName || "Customer",
        email: billing.email || "",
        contact: billing.phone || "",
      },
      theme: { color: "#4CAF50" },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay open failed", err);
      toast.error("Payment popup failed to open.");
      setLoading(false);
    }
  };

  // Place Order (entry point)
  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    if (paymentMethod === "razorpay") {
      // start Razorpay flow
      await handleRazorpayPayment();
      return;
    }

    // Cash on Delivery flow: create pending order in Firestore
    setLoading(true);
    try {
      await placeOrderToFirestore({
        status: "Pending",
        paymentStatus: "Pending",
        paymentId: null,
      });

      // clear cart / buyNow
      dispatch(clearCart());
      dispatch(setBuyNowItem(null));
      localStorage.removeItem("buyNowData");

      toast.success("Order placed (Cash on Delivery) 🎉");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err) {
      console.error("Place order failed:", err);
      toast.error("Failed to place order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black text-gray-100">
      {/* Success Modal */}
      {showSuccess && (
        <>
          <Confetti />
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
            <div className="bg-gray-800 rounded-2xl p-8 text-center shadow-2xl max-w-lg w-full">
              <CheckCircle2 className="mx-auto w-20 h-20 text-green-400 animate-bounce mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h2>
              <p className="text-gray-400">Thank you for your purchase 🎉</p>
            </div>
          </div>
        </>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 py-10">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Billing */}
          <div className="bg-gray-800/80 border border-gray-700 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Billing Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={billing.fullName || ""}
                onChange={(e) => dispatch(updateBilling({ fullName: e.target.value }))}
                className="bg-gray-900/60 border border-gray-700 text-gray-200 p-3 rounded-lg w-full"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={billing.email || ""}
                onChange={(e) => dispatch(updateBilling({ email: e.target.value }))}
                className="bg-gray-900/60 border border-gray-700 text-gray-200 p-3 rounded-lg w-full"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={billing.phone || ""}
                onChange={(e) => dispatch(updateBilling({ phone: e.target.value }))}
                className="bg-gray-900/60 border border-gray-700 text-gray-200 p-3 rounded-lg w-full"
              />
              <input
                type="text"
                placeholder="Street Address"
                value={billing.address || ""}
                onChange={(e) => dispatch(updateBilling({ address: e.target.value }))}
                className="bg-gray-900/60 border border-gray-700 text-gray-200 p-3 rounded-lg w-full md:col-span-2"
              />
              <input
                type="text"
                placeholder="City"
                value={billing.city || ""}
                onChange={(e) => dispatch(updateBilling({ city: e.target.value }))}
                className="bg-gray-900/60 border border-gray-700 text-gray-200 p-3 rounded-lg w-full"
              />
              <input
                type="text"
                placeholder="ZIP / Postal Code"
                value={billing.zip || ""}
                onChange={(e) => dispatch(updateBilling({ zip: e.target.value }))}
                className="bg-gray-900/60 border border-gray-700 text-gray-200 p-3 rounded-lg w-full"
              />
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-gray-800/80 border border-gray-700 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Shipping Address</h2>
              <label className="flex items-center space-x-2 text-sm text-gray-300">
                <input type="checkbox" checked={sameAsBilling} onChange={(e) => dispatch(setSameAsBilling(e.target.checked))} />
                <span>Same as billing</span>
              </label>
            </div>

            {!sameAsBilling && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={shipping.fullName || ""}
                  onChange={(e) => dispatch(updateShipping({ fullName: e.target.value }))}
                  className="bg-gray-900/60 border border-gray-700 text-gray-200 p-3 rounded-lg w-full"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={shipping.phone || ""}
                  onChange={(e) => dispatch(updateShipping({ phone: e.target.value }))}
                  className="bg-gray-900/60 border border-gray-700 text-gray-200 p-3 rounded-lg w-full"
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  value={shipping.address || ""}
                  onChange={(e) => dispatch(updateShipping({ address: e.target.value }))}
                  className="bg-gray-900/60 border border-gray-700 text-gray-200 p-3 rounded-lg w-full md:col-span-2"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={shipping.city || ""}
                  onChange={(e) => dispatch(updateShipping({ city: e.target.value }))}
                  className="bg-gray-900/60 border border-gray-700 text-gray-200 p-3 rounded-lg w-full"
                />
                <input
                  type="text"
                  placeholder="ZIP / Postal Code"
                  value={shipping.zip || ""}
                  onChange={(e) => dispatch(updateShipping({ zip: e.target.value }))}
                  className="bg-gray-900/60 border border-gray-700 text-gray-200 p-3 rounded-lg w-full"
                />
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="bg-gray-800/80 border border-gray-700 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Payment Method</h2>
            <div className="space-y-3 text-gray-300">
              <label className="flex items-center space-x-3 border border-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-700/40">
                <input type="radio" name="payment" value="razorpay" checked={paymentMethod === "razorpay"} onChange={() => dispatch(setPaymentMethod("razorpay"))} />
                <span>Credit / Debit Card, UPI, Wallet (via Razorpay)</span>
              </label>
              <label className="flex items-center space-x-3 border border-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-700/40">
                <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => dispatch(setPaymentMethod("cod"))} />
                <span>Cash on Delivery</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Section - Order Summary */}
        <div className="bg-gray-800/80 border border-gray-700 rounded-2xl p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4 text-white">Order Summary</h2>
          <div className="space-y-4 mb-6 text-gray-300">
            {orderSummary.items.length > 0 ? (
              orderSummary.items.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <p>{item.name} (x{item.quantity || item.qty || 1})</p>
                  <p>₹{item.price * (item.quantity || item.qty || 1)}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No items in checkout.</p>
            )}
            <hr className="border-gray-700" />
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>₹{orderSummary.subtotal}</p>
            </div>
            <div className="flex justify-between">
              <p>Shipping</p>
              <p>₹{orderSummary.shippingCost}</p>
            </div>
            <div className="flex justify-between font-semibold text-white">
              <p>Total</p>
              <p>₹{orderSummary.total}</p>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {loading ? "Processing..." : paymentMethod === "razorpay" ? "Pay with Razorpay" : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
