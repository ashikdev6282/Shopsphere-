import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FiSend, FiMessageSquare, FiX } from "react-icons/fi";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase_config";
import "./usersupportchat.css";

const UserSupportChat = () => {
  const { user, loading } = useSelector((s) => s.auth);
  const userId = user?.uid;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [adminTyping, setAdminTyping] = useState(false);
  const [adminStatus, setAdminStatus] = useState("offline");
  const messagesEndRef = useRef(null);

  /* ================= CREATE CHAT ================= */
  useEffect(() => {
    if (!userId) return;

    setDoc(
      doc(db, "supportChats", userId),
      {
        userId,
        userEmail: user.email,
        typing: { user: false, admin: false },
        presence: { admin: "offline" },
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
  }, [userId, user?.email]);

  /* ================= LISTEN CHAT DOC ================= */
  useEffect(() => {
    if (!userId) return;

    const chatRef = doc(db, "supportChats", userId);

    const unsub = onSnapshot(chatRef, (snap) => {
      const data = snap.data();
      setAdminTyping(data?.typing?.admin || false);
      setAdminStatus(data?.presence?.admin || "offline");
    });

    return () => unsub();
  }, [userId]);

  /* ================= LISTEN MESSAGES ================= */
  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "supportChats", userId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, adminTyping]);

  const handleSend = async () => {
    if (!input.trim() || !userId) return;

    await addDoc(collection(db, "supportChats", userId, "messages"), {
      sender: "user",
      text: input.trim(),
      createdAt: serverTimestamp(),
      read: false,
    });

    setInput("");
    updateDoc(doc(db, "supportChats", userId), {
      "typing.user": false,
    });
  };

  const handleTyping = async (val) => {
    if (!userId) return;
    await updateDoc(doc(db, "supportChats", userId), {
      "typing.user": val,
    });
  };

  if (loading || !userId) return null;

  return (
    <div className="support-chat-wrapper">
      <button className="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FiX /> : <FiMessageSquare />}
      </button>

      {isOpen && (
        <div className="chat-box">
          <div className="chat-header">
            💬 Support Chat
            <span className={`admin-status ${adminStatus}`}>
              {adminStatus === "online" ? "🟢 Online" : "⚫ Offline"}
            </span>
          </div>

          <div className="chat-body">
            {messages.map((m) => (
              <div key={m.id} className={`chat-msg ${m.sender}`}>
                {m.text}
              </div>
            ))}

            {adminTyping && (
              <div className="chat-msg admin typing">Admin is typing…</div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                handleTyping(true);
              }}
              onBlur={() => handleTyping(false)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
            />
            <button onClick={handleSend}><FiSend /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSupportChat;
