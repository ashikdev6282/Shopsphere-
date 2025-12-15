// src/pages/ProductDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Star, Trash2, Heart } from "lucide-react";

/* Components */
import ProductGallery from "../components/ProductDetails/Productgallery";
import ProductInfo from "../components/ProductDetails/Productinfo";
import ProductTabs from "../components/ProductDetails/ProductTabs";

/* Firebase */
import { getProductById } from "../firebase/services/productService";
import {
  fetchReviewsFS,
  addReviewFS,
  deleteReviewFS,
  hasUserReviewedFS,
} from "../firebase/services/reviewService";

/* Redux */
import {
  setProduct as setProductInStore,
  setSelectedProduct,
} from "../redux/productSlice";
import {
  setReviews,
  addReview,
  removeReview,
  setReviewLoading,
} from "../redux/reviewSlice";
import { toggleWishlist } from "../redux/wishlistSlice";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  /* Redux state */
  const products = useSelector((s) => s.product.items || []);
  const { user } = useSelector((s) => s.auth);
  const wishlist = useSelector((s) => s.wishlist.items || []);

  // ✅ SAFE reviews selector
  const reviewsState = useSelector(
    (s) => s.reviews || { items: [], loading: false }
  );
  const { items: reviews, loading: reviewLoading } = reviewsState;

  /* Local state */
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* Review form */
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isWishlisted = wishlist.some(
    (item) => String(item.id) === String(product?.id)
  );

  /* ================= LOAD PRODUCT ================= */
  useEffect(() => {
    let cancelled = false;

    const loadProduct = async () => {
      setLoading(true);
      setError(null);

      const localProduct = products.find(
        (p) => String(p.id) === String(id)
      );

      if (localProduct) {
        setProduct(localProduct);
        setLoading(false);
        return;
      }

      try {
        const doc = await getProductById(id);
        if (!cancelled) {
          if (!doc) {
            setError("Product not found");
          } else {
            setProduct(doc);
            dispatch(setSelectedProduct(doc));
            dispatch(setProductInStore(doc));
          }
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to load product");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProduct();
    return () => (cancelled = true);
  }, [id, products, dispatch]);

  /* ================= LOAD REVIEWS ================= */
  useEffect(() => {
    let mounted = true;

    const loadReviews = async () => {
      dispatch(setReviewLoading(true));
      const data = await fetchReviewsFS(id);
      if (mounted) dispatch(setReviews(data));
    };

    loadReviews();
    return () => (mounted = false);
  }, [id, dispatch]);

  /* ================= ADD REVIEW ================= */
  const handleSubmitReview = async () => {
  if (!user) {
    toast.error("Login to add a review");
    return;
  }

  if (!comment.trim()) {
    toast.error("Write a comment");
    return;
  }

  setSubmitting(true);

  try {
    // 1️⃣ Check if already reviewed
    const alreadyReviewed = await hasUserReviewedFS(id, user.uid);
    if (alreadyReviewed) {
      toast.error("You already reviewed this product");
      return;
    }

    // 2️⃣ Save review to Firestore
    await addReviewFS(id, {
      uid: user.uid,
      userName: user.name || user.email,
      rating,
      comment,
    });

    // 3️⃣ IMPORTANT: Re-fetch reviews from Firestore
    const updatedReviews = await fetchReviewsFS(id);
    dispatch(setReviews(updatedReviews));

    // 4️⃣ Reset form
    setComment("");
    setRating(5);

    toast.success("Review added ⭐");
  } catch (error) {
    console.error(error);
    toast.error("Failed to add review");
  } finally {
    setSubmitting(false);
  }
};


  /* ================= UI STATES ================= */
  if (loading)
    return (
      <div className="text-center py-20 text-gray-300">
        Loading product...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-gray-300">
        {error}
      </div>
    );

  if (!product) return null;

  const safeProduct = {
    ...product,
    image: product.image || "/images/fallback.jpg",
  };

  /* ================= UI ================= */
  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      {/* PRODUCT */}
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
        <ProductGallery product={safeProduct} />

        {/* Wishlist */}
        <button
          onClick={() => dispatch(toggleWishlist(safeProduct))}
          className="absolute top-6 right-6 bg-black/60 p-3 rounded-full z-10"
        >
          <Heart
            size={24}
            className={
              isWishlisted
                ? "fill-pink-500 text-pink-500"
                : "text-white"
            }
          />
        </button>

        <ProductInfo product={safeProduct} />
      </div>

      <div className="container mx-auto px-6">
        <ProductTabs product={safeProduct}  />
      </div>
    </div>
  );
}
