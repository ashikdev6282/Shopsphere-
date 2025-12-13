// src/pages/admin/AdminProducts.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedProduct, clearSelectedProduct, setProducts } from "../../redux/productSlice";
import ProductModal from "../components/productModal";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import toast from "react-hot-toast";
import {
  createProduct,
  updateProductById,
  deleteProductById,
  fetchProducts,
} from "../../firebase/services/productService";

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.product);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load from Firestore on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const data = await fetchProducts();
        if (!cancelled) dispatch(setProducts(data.length ? data : []));
        // keep dummy fallback removed since Firestore is canonical now
      } catch (err) {
        console.error("Failed to fetch products:", err);
        toast.error("Could not load products from the server.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => (cancelled = true);
  }, [dispatch]);

  const filtered = (items || []).filter((p) =>
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

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this product?");
    if (!ok) return;
    try {
      await deleteProductById(id);
      // refresh list
      const data = await fetchProducts();
      dispatch(setProducts(data));
      toast.success("Product deleted successfully 🗑️");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete product.");
    }
  };

  // Toggle status -> patch update
  const handleToggle = async (product) => {
    try {
      const updated = { ...product, active: !product.active };
      await updateProductById(product.id, { active: updated.active });
      const data = await fetchProducts();
      dispatch(setProducts(data));
      toast.success("Product status updated ⚡");
    } catch (err) {
      console.error("Toggle failed:", err);
      toast.error("Failed to update product status.");
    }
  };

  // Save handler passed to ProductModal
  const handleSaveFromModal = async (formData, editingId) => {
    try {
      setShowModal(false);
      if (editingId) {
        await updateProductById(editingId, formData);
        toast.success("Product updated ✅");
      } else {
        await createProduct(formData);
        toast.success("Product created ✅");
      }
      // refresh
      const data = await fetchProducts();
      dispatch(setProducts(data));
    } catch (err) {
      console.error("Save product failed:", err);
      toast.error("Failed to save product.");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-pink-400 tracking-wide">Products Management</h1>
        <button
          onClick={handleAdd}
          className="flex items-center bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-lg shadow-md transition"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </button>
      </div>

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
            {loading ? (
              <tr><td colSpan="8" className="text-center py-6">Loading products...</td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-400 italic">No products found.</td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr key={product.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition">
                  <td className="px-6 py-3 font-medium">{product.name}</td>
                  <td className="px-6 py-3">{product.category}</td>
                  <td className="px-6 py-3">₹{product.price}</td>
                  <td className="px-6 py-3">
                    <img
                      src={product.image || "/images/fallback.jpg"}
                      alt={product.name}
                      className="w-16 h-12 object-cover rounded"
                      onError={(e) => (e.currentTarget.src = "/images/fallback.jpg")}
                    />
                  </td>
                  <td className="px-6 py-3">{product.desc}</td>
                  <td className="px-6 py-3">{product.stock ?? "N/A"}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleToggle(product)}
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        product.active ? "bg-green-600/80 text-white" : "bg-red-600/80 text-white"
                      }`}
                    >
                      {product.active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-3 flex justify-end space-x-3">
                    <button onClick={() => handleEdit(product)} className="p-2 bg-blue-500 hover:bg-blue-600 rounded-md">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 bg-red-500 hover:bg-red-600 rounded-md">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <ProductModal
          onClose={() => setShowModal(false)}
          onSave={handleSaveFromModal} // modal should call onSave(formData, editingId)
        />
      )}
    </div>
  );
};

export default AdminProducts;
