import React, { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSameAsBilling, setPaymentMethod, updateBilling, updateShipping, setBuyNowItem, } from "../redux/checkoutSlice";
import { CheckCircle2 } from "lucide-react";
import Confetti from "react-confetti";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const { sameAsBilling,  paymentMethod,  billing,  shipping,  buyNowItem,} = useSelector((state) => state.checkout);
  const cartItems = useSelector((state) => state.cart.items);

  const [showSuccess, setShowSuccess] = useState(false);

  // 🟢 Restore buyNowItem from localStorage if missing
  useEffect(() => {
    const savedBuyNow = localStorage.getItem("buyNowData");
    if (!buyNowItem && savedBuyNow) {
      dispatch(setBuyNowItem(JSON.parse(savedBuyNow)));
    }
  }, [buyNowItem, dispatch]);

  // 🟢 Choose items: BuyNow or Cart
  const items = buyNowItem ? [buyNowItem] : cartItems;

  // 🟢 Calculate order summary dynamically
  const orderSummary = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) =>
        sum + item.price * (item.quantity || item.qty || 1),
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

  // ✅ Razorpay Payment Handler
  const handleRazorpayPayment = () => {
    const options = {
      key: "rzp_test_xxxxxxxx", // replace with your Razorpay key
      amount: orderSummary.total * 100,
      currency: "INR",
      name: "My E-Commerce Store",
      description: "Order Payment",
      handler: function (response) {
        console.log("Payment success:", response);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
      },
      prefill: {
        name: billing.fullName || "Customer",
        email: billing.email || "test@example.com",
        contact: billing.phone || "9999999999",
      },
      theme: { color: "#4CAF50" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // ✅ Place Order
  const handlePlaceOrder = () => {
    if (items.length === 0) {
      alert("⚠️ Your cart is empty!");
      return;
    }
    if (paymentMethod === "razorpay") {
      handleRazorpayPayment();
    } else {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black text-gray-100">
      {/* 🎉 Success Modal */}
      {showSuccess && (
        <>
          <Confetti />
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
            <div className="bg-gray-800 rounded-2xl p-8 text-center shadow-2xl max-w-lg w-full">
              <CheckCircle2 className="mx-auto w-20 h-20 text-green-400 animate-bounce mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Order Confirmed!
              </h2>
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
            <h2 className="text-xl font-semibold mb-4 text-white">
              Billing Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={billing.fullName}
                onChange={(e) =>
                  dispatch(updateBilling({ fullName: e.target.value }))
                }
                className="bg-gray-900/60 border border-gray-700 text-gray-200 p-3 rounded-lg w-full"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={billing.email}
                onChange={(e) =>
                  dispatch(updateBilling({ email: e.target.value }))
                }
                className="bg-gray-900/60 border border-gray-700 text-gray-200 p-3 rounded-lg w-full"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={billing.phone}
                onChange={(e) =>
                  dispatch(updateBilling({ phone: e.target.value }))
                }
                className="bg-gray-900/60 border border-gray-700 text-gray-200 p-3 rounded-lg w-full"
              />
              <input
                type="text"
                placeholder="Street Address"
                value={billing.address}
                onChange={(e) =>
                  dispatch(updateBilling({ address: e.target.value }))
                }
                className="bg-gray-900/60 border border-gray-700 text-gray-200 p-3 rounded-lg w-full md:col-span-2"
              />
              <input
                type="text"
                placeholder="City"
                value={billing.city}
                onChange={(e) =>
                  dispatch(updateBilling({ city: e.target.value }))
                }
                className="bg-gray-900/60 border border-gray-700 text-gray-200 p-3 rounded-lg w-full"
              />
              <input
                type="text"
                placeholder="ZIP / Postal Code"
                value={billing.zip}
                onChange={(e) =>
                  dispatch(updateBilling({ zip: e.target.value }))
                }
                className="bg-gray-900/60 border border-gray-700 text-gray-200 p-3 rounded-lg w-full"
              />
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-gray-800/80 border border-gray-700 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Shipping Address
              </h2>
              <label className="flex items-center space-x-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={sameAsBilling}
                  onChange={(e) =>
                    dispatch(setSameAsBilling(e.target.checked))
                  }
                />
                <span>Same as billing</span>
              </label>
            </div>

            {!sameAsBilling && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={shipping.fullName}
                  onChange={(e) =>
                    dispatch(updateShipping({ fullName: e.target.value }))
                  }
                  className="bg-gray-900/60 border border-gray-700 text-gray-200 p-3 rounded-lg w-full"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={shipping.phone}
                  onChange={(e) =>
                    dispatch(updateShipping({ phone: e.target.value }))
                  }
                  className="bg-gray-900/60 border border-gray-700 text-gray-200 p-3 rounded-lg w-full"
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  value={shipping.address}
                  onChange={(e) =>
                    dispatch(updateShipping({ address: e.target.value }))
                  }
                  className="bg-gray-900/60 border border-gray-700 text-gray-200 p-3 rounded-lg w-full md:col-span-2"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={shipping.city}
                  onChange={(e) =>
                    dispatch(updateShipping({ city: e.target.value }))
                  }
                  className="bg-gray-900/60 border border-gray-700 text-gray-200 p-3 rounded-lg w-full"
                />
                <input
                  type="text"
                  placeholder="ZIP / Postal Code"
                  value={shipping.zip}
                  onChange={(e) =>
                    dispatch(updateShipping({ zip: e.target.value }))
                  }
                  className="bg-gray-900/60 border border-gray-700 text-gray-200 p-3 rounded-lg w-full"
                />
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="bg-gray-800/80 border border-gray-700 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Payment Method
            </h2>
            <div className="space-y-3 text-gray-300">
              <label className="flex items-center space-x-3 border border-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-700/40">
                <input
                  type="radio"
                  name="payment"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={() => dispatch(setPaymentMethod("razorpay"))}
                />
                <span>Credit / Debit Card, UPI, Wallet (via Razorpay)</span>
              </label>
              <label className="flex items-center space-x-3 border border-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-700/40">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => dispatch(setPaymentMethod("cod"))}
                />
                <span>Cash on Delivery</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Section - Order Summary */}
        <div className="bg-gray-800/80 border border-gray-700 rounded-2xl p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Order Summary
          </h2>
          <div className="space-y-4 mb-6 text-gray-300">
            {orderSummary.items.length > 0 ? (
              orderSummary.items.map((item, idx) => (
                <div key={idx} className="flex justify-between">
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

          <button
            onClick={handlePlaceOrder}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg"
          >
            {paymentMethod === "razorpay" ? "Pay with Razorpay" : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
