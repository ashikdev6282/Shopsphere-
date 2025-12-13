// src/pages/ProductDetailsPage.jsx
import React, { useEffect, useState } from "react";
import ProductGallery from "../components/ProductDetails/Productgallery";
import ProductInfo from "../components/ProductDetails/Productinfo";
import ProductTabs from "../components/ProductDetails/ProductTabs";
import ProductReviews from "../components/ProductDetails/ProductReviews";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getProductById as fetchProductById } from "../firebase/services/productService";
import { setProduct as setProductInStore } from "../redux/productSlice";

export default function ProductDetailsPage() {
  const { id } = useParams(); // id may be a string (Firestore doc id) or numeric string for legacy data
  const dispatch = useDispatch();

  const products = useSelector((s) => s.product.items || []);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Try to find product in Redux list first for snappy UI
  useEffect(() => {
    setLoading(true);
    setError(null);

    // Try exact match (string id from Firestore)
    const foundById = products.find((p) => String(p.id) === String(id));
    // Also attempt numeric match for legacy local arrays that used numeric ids
    const foundByNumeric = products.find((p) => Number(p.id) === Number(id) && !Number.isNaN(Number(id)));

    const initial = foundById || foundByNumeric || null;
    if (initial) {
      setProduct(initial);
      setLoading(false);
      return;
    }

    // If not found locally, fetch single doc from Firestore
    let cancelled = false;
    (async () => {
      try {
        const doc = await fetchProductById(id);
        if (!cancelled) {
          if (doc) { 
            setProduct(doc);
            dispatch(setSelectedProduct(doc));
            // keep Redux in sync (optional)
            dispatch(setProductInStore(doc));
          } else {
            setError("Product not found.");
          }
        }
      } catch (err) {
        console.error("Failed to load product:", err);
        if (!cancelled) setError("Failed to load product. Try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, products, dispatch]);

  if (loading) {
    return <div className="text-center py-20 text-gray-300">Loading product...</div>;
  }

  if (error) {
    return (
      <div className="text-center sm:text-3xl font-bold px-6 sm:px-0 sm:pt-12 sm:pb-6 py-20 text-gray-300">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center sm:text-3xl font-bold px-6 sm:px-0 sm:pt-12 sm:pb-6 py-20 text-gray-300">
        Product not found.
      </div>
    );
  }

  // Ensure product.image fallback handled in gallery component,
  // but pass a safe value here as well
  const safeProduct = {
    ...product,
    image: product.image || "/images/fallback.jpg",
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      {/* Product Section */}
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Gallery */}
        <ProductGallery product={safeProduct} />

        {/* Right: Info */}
        <ProductInfo product={safeProduct} />
      </div>

      {/* Tabs (Description / Specs / Reviews) */}
      <div className="container mx-auto px-6">
        <ProductTabs product={safeProduct} />
      </div>

      {/* Related Products / Reviews */}
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <ProductReviews product={safeProduct} />
      </div>
    </div>
  );
}
