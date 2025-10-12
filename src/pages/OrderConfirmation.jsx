import React, { useEffect } from "react";
import confetti from "canvas-confetti";

export default function OrderConfirmation() {
  useEffect(() => {
    // Fire confetti on mount 🎉
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black text-gray-100 flex items-center justify-center px-6 py-12">
      <div className="bg-white text-gray-900 shadow-lg rounded-2xl max-w-3xl w-full p-8">
        {/* Animated Success Checkmark */}
        <div className="flex flex-col items-center text-center">
          <div className="success-checkmark mb-4">
            <div className="check-icon">
              <span className="icon-line line-tip"></span>
              <span className="icon-line line-long"></span>
              <div className="icon-circle"></div>
              <div className="icon-fix"></div>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Thank you for your order!</h1>
          <p className="text-gray-600 mb-6">
            Your order has been placed successfully. You will receive a
            confirmation email shortly.
          </p>
        </div>

        {/* Order Info */}
        <div className="bg-gray-50 border rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">Order Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <p><span className="font-semibold">Order ID:</span> #123456</p>
            <p><span className="font-semibold">Date:</span> March 15, 2025</p>
            <p><span className="font-semibold">Payment:</span> Razorpay</p>
            <p><span className="font-semibold">Status:</span> Confirmed</p>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-gray-50 border rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">Shipping To</h2>
          <p className="text-sm text-gray-700">
            John Doe <br />
            123 Main Street, Apartment 4B <br />
            New York, NY 10001 <br />
            Phone: +1 555-123-4567
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Estimated Delivery: <span className="font-semibold">March 20–22, 2025</span>
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 border rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <p>Product 1 (x1)</p>
              <p>$40.00</p>
            </div>
            <div className="flex justify-between">
              <p>Product 2 (x2)</p>
              <p>$80.00</p>
            </div>
            <hr />
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>$120.00</p>
            </div>
            <div className="flex justify-between">
              <p>Shipping</p>
              <p>$0.00</p>
            </div>
            <div className="flex justify-between font-semibold">
              <p>Total</p>
              <p>$120.00</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="w-full sm:w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">
            Continue Shopping
          </button>
          <button className="w-full sm:w-1/2 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-lg transition">
            Track Order
          </button>
        </div>
      </div>

      {/* ✅ CSS Animation for Checkmark */}
      <style>{`
        .success-checkmark {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .check-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          position: relative;
          border: 4px solid #4ade80; /* green-400 */
        }
        .icon-line {
          height: 5px;
          background-color: #4ade80;
          display: block;
          border-radius: 2px;
          position: absolute;
        }
        .line-tip {
          width: 25px;
          left: 14px;
          top: 38px;
          transform: rotate(45deg);
          animation: tip 0.4s ease forwards;
        }
        .line-long {
          width: 47px;
          right: 8px;
          top: 28px;
          transform: rotate(-45deg);
          animation: long 0.4s ease forwards 0.2s;
        }
        @keyframes tip {
          0% { width: 0; }
          100% { width: 25px; }
        }
        @keyframes long {
          0% { width: 0; }
          100% { width: 47px; }
        }
      `}</style>
    </div>
  );
}
