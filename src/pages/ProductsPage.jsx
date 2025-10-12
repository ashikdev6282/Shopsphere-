import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../redux/cartSlice";
import { setSelectedProduct, setProducts } from "../redux/productSlice";
import toast from "react-hot-toast";  // ✅ import toast

const dummyProducts = [
  { id: 1, name: 'Red Gown', category: 'Dress', price: 120, image: '/images/red-gown.jpg', desc: 'Elegant evening gown' },
  { id: 2, name: 'Floral Skirt', category: 'Dress', price: 80, image: '/images/floral-skirt.jpg', desc: 'Light and breezy skirt' },
  { id: 3, name: 'Men Formal Suit', category: 'Dress', price: 150, image: '/images/formal-suit.jpg', desc: 'Classic business suit' },
  { id: 4, name: 'Smartphone', category: 'Electronics', price: 699, image: '/images/phone.jpg', desc: 'Latest model with 5G' },
  { id: 5, name: 'Smartwatch', category: 'Electronics', price: 199, image: '/images/watch.jpg', desc: 'Tracks health & fitness' },
  { id: 6, name: 'Bluetooth Speaker', category: 'Electronics', price: 99, image: '/images/speaker.jpg', desc: 'Portable and powerful sound' },
  { id: 7, name: 'Leather Bag', category: 'Accessories', price: 89, image: '/images/bag.jpg', desc: 'Stylish and spacious' },
  { id: 8, name: 'Sunglasses', category: 'Accessories', price: 59, image: '/images/sunglasses.jpg', desc: 'UV protection lenses' },
  { id: 9, name: 'Bracelet Set', category: 'Accessories', price: 39, image: '/images/bracelet.jpg', desc: 'Chic everyday wear' },
  { id: 10, name: 'Wall Art', category: 'Home Decor', price: 75, image: '/images/wallart.jpg', desc: 'Modern abstract painting' },
  { id: 11, name: 'Cushion Set', category: 'Home Decor', price: 45, image: '/images/cushion.jpg', desc: 'Soft decorative cushions' },
  { id: 12, name: 'Table Lamp', category: 'Home Decor', price: 60, image: '/images/lamp.jpg', desc: 'Warm ambient lighting' },
];

const categories = ["All", "Dress", "Electronics", "Accessories", "Home Decor"];

const Products = () => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = useSelector((state) => state.product.items) || [];

  useEffect(() => {
    dispatch(setProducts(dummyProducts));
    AOS.init({ duration: 700 });
  }, [dispatch]);

  // ✅ filtering
  let filteredProducts = products
    .filter((p) => (filter === "All" ? true : p.category === filter))
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => p.price <= maxPrice);

  if (sortOrder === "low-high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "high-low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  // ✅ Handle View Details
  const handleViewDetails = (product) => {
    dispatch(setSelectedProduct(product));
    navigate(`/products/${product.id}`);
  };

  // ✅ Handle Add to Cart with Toast
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart 🛒`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: "dark",
      className:
        "!bg-gray-900 !text-white !rounded-xl !border !border-pink-500/50 shadow-lg shadow-pink-500/30 backdrop-blur-md",
      progressClassName: "!bg-gradient-to-r from-indigo-500 to-pink-500",
    });
  };

  return (
    <div className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-black min-h-screen py-16 px-4 sm:px-10 overflow-hidden text-white">

      
      {/* Heading */}
      <div className="text-center z-10 relative mb-14" data-aos="fade-down">
        <h2 className="text-5xl font-serif italic tracking-wide relative inline-block text-lime-400 bg-gradient-to-r from-indigo-300 to-pink-600 bg-clip-text text-transparent">
          Our Products
          <svg
            className="absolute left-1/2 -translate-x-1/2 mt-2"
            width="200"
            height="20"
            viewBox="0 0 200 20"
            fill="none"
          >
            <path
              d="M5 15C50 5 150 25 195 10"
              stroke="#bcf85dff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="200"
              strokeDashoffset="200"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="200"
                to="0"
                dur="1s"
                fill="freeze"
                begin="0.3s"
              />
            </path>
          </svg>
        </h2>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4 mb-12 z-10 relative">
        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2 rounded-full border transition-all duration-300 ${
              filter === cat
                ? "bg-gradient-to-r from-indigo-300 to-pink-600 bg-clip-text text-transparent text-black border-pink-300 shadow-lg"
                : "bg-gradient-to-r from-indigo-300 to-pink-600 bg-clip-text text-transparent text-gray-300 border-pink-600 hover:bg-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-md bg-gradient-to-r from-indigo-300 to-pink-600 bg-clip-text text-transparent border-pink-700 placeholder-pink-400"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-4 py-2 border rounded-md bg-gradient-to-r from-indigo-300 to-pink-600 bg-clip-text text-transparent border-pink-700"
        >
          <option value="" className="text-gray-300 ">Sort By</option>
          <option value="low-high" className="text-gray-600">Price: Low → High</option>
          <option value="high-low" className="text-gray-600">Price: High → Low</option>
        </select>
        <div className="flex items-center gap-2 text-gray-300">
          <label>Max Price: ${maxPrice}</label>
          <input
            type="range"  
            min="20"
            max="1000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="accent-pink-600"
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 z-10 relative">
        {filteredProducts.map((product, index) => (
          <div
            key={index}
            data-aos="fade-up"
            className="bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 shadow-xl"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-5">
              <h3 className="text-lg font-semibold text-pink-500">
                {product.name}
              </h3>
              <p className="text-sm text-gray-400 mb-2">{product.desc}</p>
              <p className="text-pink-400 font-bold">${product.price}</p>
              <span className="text-xs text-gray-500">{product.category}</span>

              {/* Buttons */}
              <div className="mt-3 flex items-center justify-center gap-4">
                <button
                  onClick={() => handleViewDetails(product)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-pink-600 font-medium transition"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleAddToCart(product)} // ✅ added toast here
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-pink-600 font-medium transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
