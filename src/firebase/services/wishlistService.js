import { doc, setDoc, deleteDoc, getDocs, collection, serverTimestamp,} from "firebase/firestore";
import { db } from "../firebase_config";


/* Add item */
export const addToWishlistFS = async (uid, product) => {
  const ref = doc(db, "users", uid, "wishlist", String(product.id));
  await setDoc(ref, {
    ...product,
    createdAt: serverTimestamp(),
  });
};

/* Remove item */
export const removeFromWishlistFS = async (uid, productId) => {
  const ref = doc(db, "users", uid, "wishlist", String(productId));
  await deleteDoc(ref);
};

/* Fetch wishlist */
export const fetchWishlistFS = async (uid) => {
  const snap = await getDocs(collection(db, "users", uid, "wishlist")); 
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
