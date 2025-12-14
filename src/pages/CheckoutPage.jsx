// src/pages/CheckoutPage.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSameAsBilling, setPaymentMethod, updateBilling, updateShipping, setBuyNowItem,} from "../redux/checkoutSlice";
import { clearCart } from "../redux/cartSlice";
import { CheckCircle2 } from "lucide-react";
import Confetti from "react-confetti";
import toast from "react-hot-toast";
import { createOrder } from "../firebase/services/orderService";
import { auth } from "../firebase/firebase_config";

/** Simple validator */
const isEmpty = (str) => !str || str.trim().length === 0;

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const { sameAsBilling, paymentMethod, billing, shipping, buyNowItem } =
    useSelector((state) => state.checkout);
  const cartItems = useSelector((state) => state.cart.items || []);

  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // validation

  // Restore Buy Now
  useEffect(() => {
    const savedBuyNow = localStorage.getItem("buyNowData");
    if (!buyNowItem && savedBuyNow) {
      try {
        dispatch(setBuyNowItem(JSON.parse(savedBuyNow)));
      } catch {}
    }
  }, [buyNowItem, dispatch]);

  const items = buyNowItem ? [buyNowItem] : cartItems;

  /** ORDER SUMMARY */
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

  /** VALIDATION */
  const validateFields = () => {
    const newErr = {};

    // Billing Fields
    if (isEmpty(billing.fullName)) newErr.fullName = "Name is required";
    if (isEmpty(billing.email)) newErr.email = "Email is required";
    if (isEmpty(billing.phone)) newErr.phone = "Phone is required";
    if (isEmpty(billing.address)) newErr.address = "Address is required";
    if (isEmpty(billing.city)) newErr.city = "City is required";
    if (isEmpty(billing.zip)) newErr.zip = "Zip code required";

    // Shipping Fields if different
    if (!sameAsBilling) {
      if (isEmpty(shipping.fullName)) newErr.shipFullName = "Name required";
      if (isEmpty(shipping.phone)) newErr.shipPhone = "Phone required";
      if (isEmpty(shipping.address)) newErr.shipAddress = "Address required";
      if (isEmpty(shipping.city)) newErr.shipCity = "City required";
      if (isEmpty(shipping.zip)) newErr.shipZip = "Zip required";
    }

    setErrors(newErr);
    return Object.keys(newErr).length === 0; // true if no errors
  };

  /** Load Razorpay */
  const loadRazorpayScript = () =>
    new Promise((res) => {
      if (window.Razorpay) return res(true);
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => res(true);
      s.onerror = () => res(false);
      document.body.appendChild(s);
    });

  /** Save Final Order Into Firestore */
  const placeOrderToFirestore = async (opts) => {
    const user = auth.currentUser;

    const orderPayload = {
      userId: user?.uid || "guest",
      customerName:
        (sameAsBilling ? billing.fullName : shipping.fullName) ||
        billing.fullName ||
        "Guest",
      customerEmail: billing.email,
      customerPhone: billing.phone || shipping.phone,
      status: opts.status || "Pending",
      paymentStatus: opts.paymentStatus || "Pending",
      paymentMethod,
      paymentId: opts.paymentId || null,
      totalAmount: orderSummary.total,

      items: orderSummary.items.map((it) => ({
        productId: it.id,
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

      createdAt: new Date().toISOString(),
    };

    const orderId = await createOrder(orderPayload);
    return orderId;
  };

  /** RAZORPAY HANDLER */
  const handleRazorpayPayment = async () => {
    setLoading(true);
    const ok = await loadRazorpayScript();
    if (!ok) {
      toast.error("Payment SDK failed to load");
      setLoading(false);
      return;
    }

    const key = import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_xxxxxxxx";

    const options = {
      key,
      amount: Math.round(orderSummary.total * 100),
      currency: "INR",
      name: "ShopSphere",
      description: "Order Payment",

      handler: async (response) => {
        try {
          const orderId = await placeOrderToFirestore({
            status: "Processing",
            paymentStatus: "Paid",
            paymentId: response.razorpay_payment_id,
          });

          dispatch(clearCart());
          dispatch(setBuyNowItem(null));
          localStorage.removeItem("buyNowData");

          toast.success("Payment successful 🎉");
          setShowSuccess(orderId);
        } catch (err) {
          toast.error("Payment succeeded but order saving failed");
        } finally {
          setLoading(false);
        }
      },

      prefill: {
        name: billing.fullName,
        email: billing.email,
        contact: billing.phone,
      },
      theme: { color: "#4CAF50" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  /** PLACE ORDER ENTRY */
  const handlePlaceOrder = async () => {
    if (!validateFields()) {
      toast.error("Please correct the highlighted fields.");
      return;
    }

    if (paymentMethod === "razorpay") {
      await handleRazorpayPayment();
      return;
    }

    // COD
    setLoading(true);
    try {
      const orderId = await placeOrderToFirestore({
        status: "Pending",
        paymentStatus: "Pending",
        paymentId: null,
      });

      dispatch(clearCart());
      dispatch(setBuyNowItem(null));
      localStorage.removeItem("buyNowData");

      toast.success("Order placed (COD)");
      setShowSuccess(orderId);
    } catch (err) {
      toast.error("Order placement failed");
    } finally {
      setLoading(false);
    }
  };

  /** iOS Soft Button Style */
  const softButton =
    "w-full py-3 rounded-2xl bg-gray-100 text-gray-900 font-semibold shadow-[0_4px_10px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_14px_rgba(255,255,255,0.2)] active:scale-95 transition text-center";

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black text-gray-100">
      {showSuccess && (
        <>
          <Confetti />
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
            <div className="bg-gray-800 rounded-2xl p-8 text-center shadow-2xl max-w-lg w-full">
              <CheckCircle2 className="mx-auto w-20 h-20 text-green-400 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
              <p className="text-gray-400 mb-3">Thank you for your purchase 🎉</p>
              <p className="text-gray-300 text-sm">
                Order ID: <span className="text-green-400">{showSuccess}</span>
              </p>
            </div>
          </div>
        </>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 py-10">
        
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-8">

          {/* BILLING */}
          <section className="bg-gray-800/80 border border-gray-700 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Billing Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["fullName", "Full Name"],
                ["email", "Email Address"],
                ["phone", "Phone Number"],
                ["address", "Street Address"],
                ["city", "City"],
                ["zip", "ZIP / Postal Code"],
              ].map(([field, label], idx) => (
                <div key={field} className={idx === 3 ? "md:col-span-2" : ""}>
                  <input
                    type="text"
                    placeholder={label}
                    value={billing[field] || ""}
                    onChange={(e) =>
                      dispatch(updateBilling({ [field]: e.target.value }))
                    }
                    className={`w-full px-3 py-2 bg-gray-900/60 border ${
                      errors[field] ? "border-red-500" : "border-gray-700"
                    } text-gray-200 rounded-lg`}
                  />
                  {errors[field] && (
                    <p className="text-red-400 text-xs mt-1">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* SHIPPING */}
          <section className="bg-gray-800/80 border border-gray-700 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Shipping Address</h2>
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={sameAsBilling}
                  onChange={(e) => dispatch(setSameAsBilling(e.target.checked))}
                />
                <span>Same as billing</span>
              </label>
            </div>

            {!sameAsBilling && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ["shipFullName", "Full Name"],
                  ["shipPhone", "Phone Number"],
                  ["shipAddress", "Street Address"],
                  ["shipCity", "City"],
                  ["shipZip", "ZIP / Postal Code"],
                ].map(([field, label], idx) => (
                  <div key={field} className={idx === 2 ? "md:col-span-2" : ""}>
                    <input
                      type="text"
                      placeholder={label}
                      value={
                        shipping[field.replace("ship", "").toLowerCase()] || ""
                      }
                      onChange={(e) =>
                        dispatch(
                          updateShipping({
                            [field.replace("ship", "").toLowerCase()]:
                              e.target.value,
                          })
                        )
                      }
                      className={`w-full px-3 py-2 bg-gray-900/60 border ${
                        errors[field] ? "border-red-500" : "border-gray-700"
                      } text-gray-200 rounded-lg`}
                    />
                    {errors[field] && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors[field]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* PAYMENT */}
          <section className="bg-gray-800/80 border border-gray-700 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

            <div className="space-y-3">
              {[
                ["razorpay", "Credit / Debit Card, UPI, Wallet (Razorpay)"],
                ["cod", "Cash on Delivery"],
              ].map(([method, label]) => (
                <label
                  key={method}
                  className={`flex items-center space-x-3 border rounded-lg p-3 cursor-pointer transition ${
                    paymentMethod === method
                      ? "border-blue-500 bg-gray-700/50"
                      : "border-gray-700 hover:bg-gray-700/40"
                  }`}
                >
                  <input
                    type="radio"
                    checked={paymentMethod === method}
                    onChange={() => dispatch(setPaymentMethod(method))}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT SIDE */}
        <aside className="bg-gray-800/80 border border-gray-700 rounded-2xl p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="space-y-4 mb-6">
            {orderSummary.items.length > 0 ? (
              orderSummary.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-gray-300">
                  <p>
                    {item.name} (x{item.quantity || item.qty || 1})
                  </p>
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

          {/* iOS Button */}
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className={`${softButton} ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading
              ? "Processing..."
              : paymentMethod === "razorpay"
              ? "Pay with Razorpay"
              : "Place Order"}
          </button>
        </aside>
      </div>
    </div>
  );
}
