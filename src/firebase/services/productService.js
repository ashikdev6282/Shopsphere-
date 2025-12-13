// src/firebase/services/productService.js
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase_config";

/**
 * Products collection ref helper
 */
const productsCol = collection(db, "products");

/**
 * Fetch all products.
 * Optional options: { category, activeOnly (bool), orderByField }
 * Returns: Array of product objects: { id, ...data }
 */
export async function fetchProducts(options = {}) {
  try {
    const { category, activeOnly = false, orderByField = "createdAt" } = options;

    let q = productsCol;

    // Build query conditions if needed
    const constraints = [];
    if (category) constraints.push(where("category", "==", category));
    if (activeOnly) constraints.push(where("active", "==", true));
    if (orderByField) constraints.push(orderBy(orderByField, "desc"));

    if (constraints.length > 0) {
      q = query(productsCol, ...constraints);
    } else if (orderByField) {
      q = query(productsCol, orderBy(orderByField, "desc"));
    }

    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error("fetchProducts error:", err);
    throw err;
  }
}

/**
 * Fetch single product by id (doc id)
 */
export async function getProductById(id) {
  try {
    const ref = doc(db, "products", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  } catch (err) {
    console.error("getProductById error:", err);
    throw err;
  }
}

/**
 * Create a new product.
 * data: { name, category, price, image, desc, stock, active, ... }
 * Returns: created doc id
 */
export async function createProduct(data) {
  try {
    const payload = {
      ...data,
      price: typeof data.price === "number" ? data.price : Number(data.price || 0),
      stock: typeof data.stock === "number" ? data.stock : Number(data.stock || 0),
      active: data.active ?? true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const ref = await addDoc(productsCol, payload);
    return ref.id;
  } catch (err) {
    console.error("createProduct error:", err);
    throw err;
  }
}

/**
 * Update product fields by doc id.
 * id: doc id
 * data: partial fields to update
 */
export async function updateProductById(id, data) {
  try {
    const ref = doc(db, "products", id);
    const payload = {
      ...data,
      // normalize numeric fields if present
      ...(data.price !== undefined ? { price: Number(data.price) } : {}),
      ...(data.stock !== undefined ? { stock: Number(data.stock) } : {}),
      updatedAt: serverTimestamp(),
    };
    await updateDoc(ref, payload);
    return true;
  } catch (err) {
    console.error("updateProductById error:", err);
    throw err;
  }
}

/**
 * Delete product by doc id.
 */
export async function deleteProductById(id) {
  try {
    const ref = doc(db, "products", id);
    await deleteDoc(ref);
    return true;
  } catch (err) {
    console.error("deleteProductById error:", err);
    throw err;
  }
}
