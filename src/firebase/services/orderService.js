// src/firebase/services/orderService.js
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase_config";

const ordersCol = collection(db, "orders");

/**
 * Fetch all orders (admin view).
 * Optional options: { orderByField }
 * Returns: [{ id, ...data }]
 */
export async function fetchAllOrders(options = {}) {
  try {
    const { orderByField = "createdAt" } = options;
    let q = ordersCol;
    if (orderByField) q = query(ordersCol, orderBy(orderByField, "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error("fetchAllOrders error:", err);
    throw err;
  }
}

/**
 * Fetch orders for a specific user (user view).
 * userId: firebase auth uid
 */
export async function fetchUserOrders(userId) {
  try {
    const q = query(ordersCol, where("userId", "==", userId), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error("fetchUserOrders error:", err);
    throw err;
  }
}

/**
 * Get single order by id
 */
export async function getOrderById(id) {
  try {
    const ref = doc(db, "orders", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  } catch (err) {
    console.error("getOrderById error:", err);
    throw err;
  }
}

/**
 * Create a new order.
 * orderData should include:
 * { userId, customerName, customerEmail, customerPhone, status, paymentStatus, paymentMethod, totalAmount, items: [{productId, name, price, quantity}], shippingAddress {...} }
 *
 * Returns: created order doc id
 */
export async function createOrder(orderData) {
  try {
    const payload = {
      ...orderData,
      totalAmount: Number(orderData.totalAmount || 0),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const ref = await addDoc(ordersCol, payload);
    return ref.id;
  } catch (err) {
    console.error("createOrder error:", err);
    throw err;
  }
}

/**
 * Update order status (or any order fields) by id.
 * id: doc id
 * updates: { status, paymentStatus, ... }
 */
export async function updateOrderStatusById(id, updates = {}) {
  try {
    const ref = doc(db, "orders", id);
    const payload = {
      ...updates,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(ref, payload);
    return true;
  } catch (err) {
    console.error("updateOrderStatusById error:", err);
    throw err;
  }
}

/**
 * Delete order by id
 */
export async function deleteOrderById(id) {
  try {
    const ref = doc(db, "orders", id);
    await deleteDoc(ref);
    return true;
  } catch (err) {
    console.error("deleteOrderById error:", err);
    throw err;
  }
}
