// src/pages/ProductsPage.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../redux/cartSlice";
import { setSelectedProduct, setProducts } from "../redux/productSlice";
import toast from "react-hot-toast";
import { fetchProducts } from "../firebase/services/productService";

const categories = ["All", "Dress", "Electronics", "Accessories", "Home Decor"];

const Products = () => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = useSelector((state) => state.product.items) || [];

  useEffect(() => {
    AOS.init({ duration: 700 });
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const data = await fetchProducts();
        if (!cancelled) {
          dispatch(setProducts(data));
        }
      } catch (err) {
        console.error("Failed to load products:", err);
        toast.error("Failed to load products. Try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  // filtering
  let filteredProducts = products
    .filter((p) => (filter === "All" ? true : p.category === filter))
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => (typeof p.price === "number" ? p.price <= maxPrice : true));

  if (sortOrder === "low-high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "high-low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  // Handle View Details
  const handleViewDetails = (product) => {
    dispatch(setSelectedProduct(product));
    navigate(`/products/${product.id}`);
  };

  // Handle Add to Cart with Toast
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart 🛒`, {
      position: "top-right",
      duration: 2000,
      style: { borderRadius: "12px" },
    });
  };

  return (
    <div className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-black min-h-screen py-16 px-4 sm:px-10 overflow-hidden text-white">
      <div className="text-center z-10 relative mb-14" data-aos="fade-down">
        <h2 className="text-5xl font-serif italic tracking-wide relative inline-block text-lime-400 bg-gradient-to-r from-indigo-300 to-pink-600 bg-clip-text text-transparent">
          Our Products
        </h2>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4 mb-12 z-10 relative">
        {categories.map((cat, i) => (
          <button
            key={cat}
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
          <option value="">Sort By</option>
          <option value="low-high">Price: Low → High</option>
          <option value="high-low">Price: High → Low</option>
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

      {/* Loading */}
      {loading ? (
        <div className="text-center py-20 text-gray-300">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 z-10 relative">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              data-aos="fade-up"
              className="bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 shadow-xl"
            >
              <img
                src={product.image || "/images/fallback.jpg"}
                alt={product.name}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/images/fallback.jpg";
                }}
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-pink-500">{product.name}</h3>
                <p className="text-sm text-gray-400 mb-2">{product.desc}</p>
                <p className="text-pink-400 font-bold">${product.price}</p>
                <span className="text-xs text-gray-500">{product.category}</span>

                <div className="mt-3 flex items-center justify-center gap-4">
                  <button
                    onClick={() => handleViewDetails(product)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-pink-600 font-medium transition"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-pink-600 font-medium transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-16 text-gray-400">No products match your filters.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
