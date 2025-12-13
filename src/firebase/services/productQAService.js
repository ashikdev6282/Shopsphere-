// src/firebase/services/productQAService.js

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase_config";

/* ================================================================
    ADD A QUESTION (customer)
   ================================================================ */
export async function addQuestion(productId, questionText, userId, userName) {
  try {
    const colRef = collection(db, "productQA", String(productId), "questions");

    const payload = {
      question: questionText,
      userId: userId || null,
      userName: userName || "Customer",
      answer: "",
      answered: false,
      createdAt: serverTimestamp(),
      answeredAt: null,
    };

    const docRef = await addDoc(colRef, payload);
    return { id: docRef.id, ...payload };
  } catch (error) {
    console.error("❌ Error adding question:", error);
    throw error;
  }
}

/* ================================================================
    FETCH QUESTIONS (product detail page or admin page)
   ================================================================ */
export async function fetchQuestions(productId) {
  try {
    const colRef = collection(db, "productQA", String(productId), "questions");

    const q = query(colRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const questions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return questions;
  } catch (error) {
    console.error("❌ Error fetching questions:", error);
    return [];
  }
}

/* ================================================================
    ANSWER A QUESTION (admin)
   ================================================================ */
export async function answerQuestion(productId, questionId, answerText) {
  try {
    const docRef = doc(db, "productQA", String(productId), "questions", questionId);

    const payload = {
      answer: answerText,
      answered: true,
      answeredAt: serverTimestamp(),
    };

    await updateDoc(docRef, payload);

    return payload;
  } catch (error) {
    console.error("❌ Error answering question:", error);
    throw error;
  }
}

/* ================================================================
    DELETE QUESTION (optional)
   ================================================================ */
export async function deleteQuestion(productId, questionId) {
  try {
    const docRef = doc(db, "productQA", String(productId), "questions", questionId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("❌ Error deleting question:", error);
    throw error;
  }
}
