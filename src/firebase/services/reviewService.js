// src/firebase/services/reviewService.js
import { collection, getDocs, addDoc, query, orderBy, serverTimestamp, } from "firebase/firestore";
import { db } from "../firebase_config";

/**
 * Fetch reviews for a productId
 * returns array of reviews: [{ id, name, rating, review, createdAt }]
 */
export async function fetchReviewsForProduct(productId) {
  if (!db) return [];
  try {
    const colRef = collection(db, "productReviews", String(productId), "reviews");
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error("fetchReviewsForProduct error:", err);
    throw err;
  }
}

/**
 * Add a review document under productReviews/{productId}/reviews
 * reviewData: { name, rating, review }
 * returns created doc id
 */
export async function addReviewForProduct(productId, reviewData) {
  if (!db) throw new Error("No Firestore DB available");
  try {
    const colRef = collection(db, "productReviews", String(productId), "reviews");
    const payload = {
      ...reviewData,
      rating: Number(reviewData.rating || 0),
      createdAt: serverTimestamp(),
    };
    const ref = await addDoc(colRef, payload);
    return ref.id;
  } catch (err) {
    console.error("addReviewForProduct error:", err);
    throw err;
  }
}
