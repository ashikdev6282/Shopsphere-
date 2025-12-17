import React, {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
} from "react";
import { Send, MessageCircle, X } from "lucide-react";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  doc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase/firebase_config";
import "./customernotepanel.css";

export default function CustomerNotesPanel({ isOpen, onClose, customer }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [userTyping, setUserTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const chatId = customer?.id ? String(customer.id) : null;
  const chatRef = chatId ? doc(db, "supportChats", chatId) : null;

  /* ================= REAL-TIME MESSAGES ================= */
  useEffect(() => {
    if (!chatId || !isOpen) return;

    const q = query(
      collection(db, "supportChats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setMessages(list);
    });

    return () => unsub();
  }, [chatId, isOpen]);

  /* ================= USER TYPING (ADMIN VIEW) ================= */
  useEffect(() => {
    if (!chatRef || !isOpen) return;

    const unsub = onSnapshot(chatRef, (snap) => {
      const data = snap.data();
      setUserTyping(Boolean(data?.typing?.user));
    });

    return () => unsub();
  }, [chatRef, isOpen]);

  /* ================= MARK USER MSGS READ + RESET ADMIN UNREAD ================= */
  useEffect(() => {
    if (!chatId || !isOpen || !chatRef) return;

    const markRead = async () => {
      const snap = await getDocs(
        collection(db, "supportChats", chatId, "messages")
      );

      snap.forEach((d) => {
        const data = d.data();
        if (data.sender === "user" && data.read === false) {
          updateDoc(d.ref, { read: true });
        }
      });

      await updateDoc(chatRef, {
        "unread.admin": 0,
      });
    };

    markRead();
  }, [chatId, isOpen, chatRef]);

  /* ================= AUTO-SCROLL (FIXED) ================= */
  useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, userTyping]);

  /* ================= SEND MESSAGE (ADMIN) ================= */
  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !chatId || !chatRef) return;

    await addDoc(collection(db, "supportChats", chatId, "messages"), {
      sender: "admin",
      text: text.trim(),
      createdAt: serverTimestamp(),
      read: false,
    });

    await updateDoc(chatRef, {
      "unread.user": (messages.filter(m => m.sender === "admin").length || 0) + 1,
      "typing.admin": false,
      updatedAt: serverTimestamp(),
    });

    setText("");
  };

  /* ================= ADMIN TYPING ================= */
  const handleTyping = async (value) => {
    if (!chatRef) return;
    await updateDoc(chatRef, {
      "typing.admin": value,
      updatedAt: serverTimestamp(),
    });
  };

  if (!customer) return null;

  return (
    <>
      {isOpen && <div className="cnp-overlay" onClick={onClose} />}

      <aside className={`customer-notes-panel ${isOpen ? "open" : ""}`}>
        <header className="panel-header">
          <div className="left">
            <MessageCircle size={18} />
            <div>
              <div className="title">Live Support</div>
              <div className="subtitle">{customer.name}</div>
            </div>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </header>

        <div className="panel-body">
          <div className="messages">
            {messages.map((m, i) => (
              <div
                key={m.id}
                ref={i === messages.length - 1 ? messagesEndRef : null}
                className={`message ${m.sender === "admin" ? "sent" : "recv"}`}
              >
                <div className="msg-text">{m.text}</div>
              </div>
            ))}

            {userTyping && (
              <div className="message recv typing">
                <div className="msg-text">User is typing…</div>
              </div>
            )}
          </div>
        </div>

        <form className="panel-footer" onSubmit={handleSend}>
          <input
            placeholder="Reply to customer…"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              handleTyping(true);
            }}
            onBlur={() => handleTyping(false)}
          />
          <button type="submit">
            <Send size={16} />
          </button>
        </form>
      </aside>
    </>
  );
}
