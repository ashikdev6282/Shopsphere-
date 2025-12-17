import {
  collection,
  doc,
  addDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase_config";

/* 🔹 Get real-time messages */
export const listenToMessages = (userId, callback) => {
  const messagesRef = collection(db, "supportChats", userId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"));

  return onSnapshot(q, (snap) => {
    const msgs = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toMillis?.() || null,
    }));
    callback(msgs);
  });
};

/* 🔹 Send message */
export const sendMessage = async ({ userId, sender, text, user }) => {
  const chatRef = doc(db, "supportChats", userId);

  // ensure parent chat exists
  await setDoc(
    chatRef,
    {
      userId,
      userName: user?.name || "",
      userEmail: user?.email || "",
      lastMessage: text,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  // add message
  await addDoc(collection(chatRef, "messages"), {
    sender,
    text,
    createdAt: serverTimestamp(),
  });
};
