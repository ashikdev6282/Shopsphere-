// src/components/productModal.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearSelectedProduct } from "../../redux/productSlice";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const ProductModal = ({ onClose, onSave }) => {
  const dispatch = useDispatch();
  const { selectedProduct } = useSelector((state) => state.product);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    desc: "",
    stock: "",
    active: true,
  });
  const [saving, setSaving] = useState(false);

  // when editing, prefill form
  useEffect(() => {
    if (selectedProduct) {
      setForm({
        name: selectedProduct.name ?? "",
        category: selectedProduct.category ?? "",
        price: selectedProduct.price ?? "",
        image: selectedProduct.image ?? "",
        desc: selectedProduct.desc ?? "",
        stock: selectedProduct.stock ?? "",
        active: selectedProduct.active ?? true,
      });
    } else {
      // reset for add new
      setForm({
        name: "",
        category: "",
        price: "",
        image: "",
        desc: "",
        stock: "",
        active: true,
      });
    }
  }, [selectedProduct]);

  const editingId = selectedProduct?.id ?? null;

  const handleChange = (field, value) => {
    setForm((s) => ({ ...s, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validation
    if (!form.name.trim() || !form.category.trim()) {
      toast.error("Please provide product name and category.");
      return;
    }
    if (form.price === "" || isNaN(Number(form.price))) {
      toast.error("Please enter a valid price.");
      return;
    }
    if (form.stock === "" || isNaN(Number(form.stock))) {
      toast.error("Please enter a valid stock value.");
      return;
    }

    // prepare payload (convert numeric fields)
    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      price: Number(parseFloat(form.price)),
      image: form.image?.trim() || "",
      desc: form.desc?.trim() || "",
      stock: Number(parseInt(form.stock, 10)),
      active: !!form.active,
    };

    try {
      setSaving(true);
      // call parent save handler (AdminProducts passes create/update logic)
      // onSave may return a Promise (we await it to show saving state)
      if (onSave) {
        await onSave(payload, editingId); // editingId === null => create
      } else {
        // fallback: show toast so dev knows onSave was not provided
        toast.error("Save handler missing. onSave(form, editingId) is required.");
      }

      // clear selected product in redux and close modal
      dispatch(clearSelectedProduct());
      onClose();
      toast.success(editingId ? "Product updated" : "Product created");
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Failed to save product. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    dispatch(clearSelectedProduct());
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 px-4">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-white">
          {editingId ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg outline-none"
          />

          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            required
            className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg outline-none"
          />

          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
            required
            className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg outline-none"
          />

          <input
            type="text"
            placeholder="Image URL (optional)"
            value={form.image}
            onChange={(e) => handleChange("image", e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg outline-none"
          />

          <input
            type="text"
            placeholder="Short Description"
            value={form.desc}
            onChange={(e) => handleChange("desc", e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg outline-none"
          />

          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
            required
            className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg outline-none"
          />

          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center space-x-2 text-gray-300">
              <input
                type="checkbox"
                checked={!!form.active}
                onChange={(e) => handleChange("active", e.target.checked)}
              />
              <span>Active</span>
            </label>

            <button
              type="submit"
              disabled={saving}
              className={`px-4 py-2 rounded-lg font-semibold ${
                saving ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
