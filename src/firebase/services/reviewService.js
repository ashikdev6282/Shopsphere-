import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  where,
  serverTimestamp,
  doc,
} from "firebase/firestore";
import { db } from "../firebase_config";

/* 🔹 Add Review */
export const addReviewFS = async (productId, review) => {
  const ref = collection(db, "products", productId, "reviews");

  const docRef = await addDoc(ref, {
    ...review,
    createdAt: serverTimestamp(),
  });

  // ✅ return serialized object for Redux
  return {
    id: docRef.id,
    ...review,
    createdAt: Date.now(),
  };
};

/* 🔹 Fetch Reviews */
export const fetchReviewsFS = async (productId) => {
  const ref = collection(db, "products", productId, "reviews");
  const q = query(ref, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => {
    const data = d.data(); // ✅ FIX
    return {
      id: d.id,
      ...data,
      createdAt: data.createdAt ? data.createdAt.toMillis() : null, // ✅ SERIALIZED
    };
  });
};

/* 🔹 Delete Review (Owner only) */
export const deleteReviewFS = async (productId, reviewId) => {
  const ref = doc(db, "products", productId, "reviews", reviewId);
  await deleteDoc(ref);
};

/* 🔹 Check if user already reviewed */
export const hasUserReviewedFS = async (productId, uid) => {
  const ref = collection(db, "products", productId, "reviews");
  const q = query(ref, where("uid", "==", uid));
  const snap = await getDocs(q);
  return !snap.empty;
};
