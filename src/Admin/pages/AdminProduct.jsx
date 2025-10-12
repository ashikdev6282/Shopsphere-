import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addProduct, updateProduct, deleteProduct, toggleProductStatus, setSelectedProduct, clearSelectedProduct, setProducts, } from "../../redux/productSlice";
import ProductModal from "../components/ProductModal";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import toast from "react-hot-toast";

// ✅ Fallback dummy data (only for first load if Redux empty)
const productsDummy = [
  { id: 1, name: "Red Gown", category: "Dress", price: 120, image: "/images/red-gown.jpg", desc: "Elegant evening gown perfect for formal events.", stock: 10, active: true },
  { id: 2, name: "Smartwatch", category: "Electronics", price: 199, image: "/images/watch.jpg", desc: "Tracks health & fitness. Bluetooth enabled.", stock: 15, active: true },
  { id: 3, name: "Leather Bag", category: "Accessories", price: 89, image: "/images/bag.jpg", desc: "Stylish and spacious leather bag.", stock: 8, active: false },
  { id: 4, name: "Wall Art", category: "Home Decor", price: 75, image: "/images/wallart.jpg", desc: "Modern abstract painting to enhance your living space.", stock: 20, active: true },
  { id: 5, name: "Bluetooth Speaker", category: "Electronics", price: 99, image: "/images/speaker.jpg", desc: "Portable and powerful sound for all occasions.", stock: 12, active: true },
  { id: 6, name: "Floral Skirt", category: "Dress", price: 80, image: "/images/floral-skirt.jpg", desc: "Light and breezy skirt for casual outings.", stock: 5, active: false },
  { id: 7, name: "Sunglasses", category: "Accessories", price: 59, image: "/images/sunglasses.jpg", desc: "UV protection lenses for sun protection.", stock: 18, active: true },
  { id: 8, name: "Cushion Set", category: "Home Decor", price: 45, image: "/images/cushion.jpg", desc: "Soft decorative cushions to add comfort.", stock: 25, active: true },
  { id: 9, name: "Table Lamp", category: "Home Decor", price: 60, image: "/images/lamp.jpg", desc: "Warm ambient lighting for any room.", stock: 14, active: true },
  { id: 10, name: "Men Formal Suit", category: "Dress", price: 150, image: "/images/formal-suit.jpg", desc: "Classic business suit for professional settings.", stock: 7, active: true },
  { id: 11, name: "Smartphone", category: "Electronics", price: 699, image: "/images/phone.jpg", desc: "Latest model with 5G connectivity.", stock: 9, active: true },
  { id: 12, name: "Bracelet Set", category: "Accessories", price: 39, image: "/images/bracelet.jpg", desc: "Chic everyday wear bracelet set.", stock: 30, active: true },
];

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.product);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  // ✅ Load dummy data if no products exist (shared with user products)
  useEffect(() => {
    if (!items || items.length === 0) {
      dispatch(setProducts(productsDummy));
    }
  }, [dispatch, items]);

  const filtered = items.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    dispatch(clearSelectedProduct());
    setShowModal(true);
  };

  const handleEdit = (product) => {
    dispatch(setSelectedProduct(product));
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this product?")) {
      dispatch(deleteProduct(id));
      toast.success("Product deleted successfully 🗑️");
    }
  };

  const handleToggle = (id) => {
    dispatch(toggleProductStatus(id));
    toast.success("Product status updated ⚡");
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-pink-400 tracking-wide">
          Products Management
        </h1>
        <button
          onClick={handleAdd}
          className="flex items-center bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-lg shadow-md transition"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-gray-800 p-3 rounded-xl mb-6 w-full md:w-1/2 shadow-inner">
        <Search className="w-5 h-5 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none w-full text-gray-200 placeholder-gray-500"
        />
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-700 text-gray-300 text-left text-sm uppercase tracking-wider">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400 italic">
                  No products found.
                </td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-700 hover:bg-gray-700/50 transition"
                >
                  <td className="px-6 py-3 font-medium">{product.name}</td>
                  <td className="px-6 py-3">{product.category}</td>
                  <td className="px-6 py-3">₹{product.price}</td>
                  <td className="px-6 py-3">{product.image}</td>
                  <td className="px-6 py-3">{product.desc}</td>
                  <td className="px-6 py-3">{product.stock ?? "N/A"}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleToggle(product.id)}
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        product.active
                          ? "bg-green-600/80 text-white"
                          : "bg-red-600/80 text-white"
                      }`}
                    >
                      {product.active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-3 flex justify-end space-x-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 bg-blue-500 hover:bg-blue-600 rounded-md"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 bg-red-500 hover:bg-red-600 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Product Modal */}
      {showModal && <ProductModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default AdminProducts;
