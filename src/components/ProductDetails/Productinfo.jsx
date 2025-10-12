import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import { setCheckoutItems, setBuyNowItem } from "../../redux/checkoutSlice"; // ✅ import checkout slice
import { Star, Minus, Plus, ShoppingCart, CreditCard } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductInfo() {
  const product = useSelector((state) => state.product.selectedProduct); 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  if (!product) {
    return <div className="text-white p-6">No product selected.</div>;
  }

  // ✅ "Buy Now" sends only this product to checkout
  const handleBuyNow = () => {
    const buyNowItem = { ...product, quantity: quantity };
    dispatch(setBuyNowItem(buyNowItem)); // Set the buy now item in checkout slice
    dispatch(setCheckoutItems([buyNowItem])); // Set checkout items to only this product
    navigate("/checkout");
  };

  return (
    <div className="text-gray-100 p-6">
      {/* Product Title */}
      <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

      {/* Rating (dummy for now) */}
      <div className="flex items-center mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-500"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-400">(120 reviews)</span>
      </div>

      {/* Price */}
      <div className="flex items-center mb-6">
        <span className="text-3xl font-semibold text-blue-400">
          ${product.price}
        </span>
      </div>

      {/* Short Description */}
      <p className="text-gray-400 mb-6 leading-relaxed">{product.desc}</p>

      {/* Quantity Selector */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={decrease}
          className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-lg hover:bg-gray-600"
        >
          <Minus size={18} />
        </button>
        <span className="text-xl font-medium">{quantity}</span>
        <button
          onClick={increase}
          className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-lg hover:bg-gray-600"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {/* Add to Cart */}
        <button
          onClick={() => dispatch(addToCart({ ...product, quantity }))}
          className="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition"
        >
          <ShoppingCart size={20} />
          Add to Cart
        </button>

        {/* Buy Now */}
        <button
          onClick={handleBuyNow}
          className="flex-1 py-3 rounded-2xl bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 transition"
        >
          <CreditCard size={20} />
          Buy Now
        </button>
      </div>
    </div>
  );
}
