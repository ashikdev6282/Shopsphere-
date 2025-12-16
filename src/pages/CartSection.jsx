import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../redux/cartSlice";
import { setCheckoutItems } from "../redux/checkoutSlice";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* 🔹 Skeleton loading */
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  /* 🔹 Cart items */
  const items = useSelector((state) => state.cart.items || []);

  const handleProceedToCheckout = () => {
    dispatch(setCheckoutItems(items));
    navigate("/checkout");
  };

  /* 🔹 SweetAlert remove */
  const handleRemove = async (id) => {
    const result = await Swal.fire({
      title: "Remove item?",
      text: "This item will be removed from your cart.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Remove",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#4b5563",
      background: "#111827",
      color: "#f9fafb",
    });

    if (result.isConfirmed) {
      dispatch(removeFromCart(id));
    }
  };

  const totalAmount = items.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  /* 🔹 Skeleton Item */
  const CartSkeleton = () => (
    <div className="flex flex-col sm:flex-row bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-5 shadow-xl animate-pulse">
      <div className="w-32 h-32 bg-gray-700 rounded-xl" />
      <div className="sm:ml-6 mt-4 sm:mt-0 flex-1 space-y-4">
        <div className="h-5 w-2/3 bg-gray-700 rounded" />
        <div className="h-4 w-1/3 bg-gray-700 rounded" />
        <div className="h-8 w-24 bg-gray-700 rounded mt-4" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900/90 to-black text-gray-100 py-10 px-4 sm:px-8 lg:px-16">
      <h1 className="text-center text-4xl font-extrabold tracking-tight mb-10">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-lime-300 to-emerald-400">
          Your Cart
        </span>
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <CartSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gray-900/60 backdrop-blur-xl p-10 text-center shadow-2xl">
            <div className="mx-auto mb-6 h-44 w-44 rounded-2xl bg-gray-800/80 grid place-items-center shadow-inner">
              <span className="text-7xl">🛍️</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
              Oops! your cart is <span className="text-lime-400">empty</span> 😅
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              Looks like you haven’t added anything yet. Explore our products and fill it up!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold bg-lime-400 text-black hover:bg-lime-300 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-5 shadow-xl hover:shadow-2xl transition"
              >
                <div className="shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-32 h-32 object-contain rounded-xl bg-gray-800"
                  />
                </div>

                <div className="sm:ml-6 mt-4 sm:mt-0 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Delivery by{" "}
                        <span className="text-gray-300 font-medium">
                          Tomorrow
                        </span>{" "}
                        🚚
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-400 hover:text-red-300 inline-flex items-center gap-2"
                    >
                      <FaTrash /> <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => dispatch(decreaseQuantity(item.id))}
                        className="p-2 rounded-full border border-gray-700 hover:bg-gray-800"
                      >
                        <FaMinus size={12} />
                      </button>

                      <span className="px-4 py-1 rounded-lg bg-gray-800 text-gray-100 font-semibold">
                        {item.quantity ?? 1}
                      </span>

                      <button
                        onClick={() => dispatch(increaseQuantity(item.id))}
                        className="p-2 rounded-full border border-gray-700 hover:bg-gray-800"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>

                    <p className="text-2xl font-bold text-lime-400">
                      $
                      {(
                        (item.price || 0) * (item.quantity || 1)
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <aside className="h-max sticky top-24 rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-xl p-6 shadow-2xl">
            <h4 className="text-xl font-bold text-white border-b border-gray-800 pb-4 mb-4">
              Price Details
            </h4>

            <div className="space-y-3 text-gray-300">
              <div className="flex justify-between">
                <span>Price ({items.length} items)</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-emerald-400">-$15.00</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-emerald-400">FREE</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-white border-t border-gray-800 pt-4">
                <span>Total Amount</span>
                <span>${(totalAmount - 15).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="mt-6 w-full rounded-xl bg-lime-400 text-black font-semibold py-3 hover:bg-lime-300 transition"
            >
              Place Order
            </button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;
