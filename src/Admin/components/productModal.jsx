import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, updateProduct, clearSelectedProduct, } from "../../redux/productSlice";
import { X } from "lucide-react";

const ProductModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { selectedProduct } = useSelector((state) => state.product);

  const [form, setForm] = useState({
    id: Date.now(),
    name: "",
    category: "",
    price: "",
    image: "",
    desc: "",
    stock: "",
    active: true,
  });

  useEffect(() => {
    if (selectedProduct) setForm(selectedProduct);
  }, [selectedProduct]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedProduct) dispatch(updateProduct(form));
    else dispatch(addProduct(form));
    dispatch(clearSelectedProduct());
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-gray-900 rounded-2xl p-6 w-[90%] sm:w-[400px] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {selectedProduct ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg outline-none"
          />
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
            className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg outline-none"
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
            className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg outline-none"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            required
            className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg outline-none"
          />
          <input
            type="text"
            placeholder="Description"
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
            required
            className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg outline-none"
          />
          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
            className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg outline-none"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition font-semibold"
          >
            {selectedProduct ? "Update" : "Add"} Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
