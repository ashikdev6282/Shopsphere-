import React, { useEffect, useRef, useState } from "react";
import { Send, MessageCircle, X } from "lucide-react";
import "./customernotepanel.css";

/**
 * CustomerNotesPanel
 * Props:
 *  - isOpen (bool) : whether panel is visible
 *  - onClose (fn)
 *  - customer (object) : { id, name, email, ... }
 *
 * Behavior:
 *  - stores messages per-customer in localStorage (so frontend-only persistence)
 *  - simulates "other admin typing" and auto-replies
 *  - typing indicator for remote user
 */

const AUTO_REPLIES = [
  "Customer replied: 'Thanks, will confirm soon!'",
  "System note: Order #4521 was delivered.",
  "Admin 3: Let's mark this customer as high-priority.",
  "System alert: Payment verification completed.",
];

const STORAGE_KEY = (customerId) => `customer_notes_${customerId}`;

export default function CustomerNotesPanel({ isOpen, onClose, customer }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [remoteTyping, setRemoteTyping] = useState(false);
  const [autoIdx, setAutoIdx] = useState(0);
  const messagesRef = useRef(null);
  const autoTimerRef = useRef(null);

  // load messages when customer changes or panel opens
  useEffect(() => {
    if (!customer) return;
    const saved = window.localStorage.getItem(STORAGE_KEY(customer.id));
    setMessages(saved ? JSON.parse(saved) : [
      // optional starter messages per-customer; keep small
      { id: 1, sender: "Admin 1", text: "Hey team, remember to follow up tomorrow.", time: "09:20 AM" },
      { id: 2, sender: "Admin 2", text: "Sure — I'll draft an email tonight.", time: "09:25 AM" },
    ]);
    setAutoIdx(0);
  }, [customer]);

  // persist messages to localStorage on change
  useEffect(() => {
    if (!customer) return;
    window.localStorage.setItem(STORAGE_KEY(customer.id), JSON.stringify(messages));
    // scroll to bottom
    messagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, customer]);

  // simulate remote typing + auto reply while panel is open
  useEffect(() => {
    if (!isOpen || !customer) return;
    // every 12s (only while auto replies remain) simulate typing then add message
    autoTimerRef.current = setInterval(() => {
      if (autoIdx >= AUTO_REPLIES.length) return;
      setRemoteTyping(true);
      // typing duration
      setTimeout(() => {
        setRemoteTyping(false);
        const newMsg = {
          id: Date.now(),
          sender: "System Bot",
          text: AUTO_REPLIES[autoIdx],
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((m) => [...m, newMsg]);
        setAutoIdx((i) => i + 1);
      }, 2200 + Math.random() * 1800);
    }, 12000);
    return () => clearInterval(autoTimerRef.current);
  }, [isOpen, customer, autoIdx]);

  // send message (You)
  const handleSend = (e) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !customer) return;
    const msg = {
      id: Date.now(),
      sender: "You",
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((m) => [...m, msg]);
    setText("");
    // optional immediate local "echo" of remote typing - commented out because auto-replies handle system messages
    // setRemoteTyping(true); setTimeout(()=>setRemoteTyping(false), 1400)
  };

  if (!customer) return null; // nothing to show

  return (
    <>
      {/* overlay clickable to close (z-index beneath panel) */}
      {isOpen && <div className="cnp-overlay" onClick={onClose} />}

      <aside className={`customer-notes-panel ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}>
        <header className="panel-header">
          <div className="left">
            <MessageCircle size={18} />
            <div className="panel-title">
              <div className="title">Collaboration Panel</div>
              <div className="subtitle">{customer.name}</div>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <X />
          </button>
        </header>

        <div className="panel-body">
          <div className="customer-meta">
            <div className="meta-name">{customer.name}</div>
            <div className="meta-email">{customer.email}</div>
          </div>

          <div className="messages">
            {messages.map((m) => (
              <div key={m.id} className={`message ${m.sender === "You" ? "sent" : "recv"}`}>
                <div className="msg-head">
                  <span className="msg-sender">{m.sender}</span>
                  <span className="msg-time">{m.time}</span>
                </div>
                <div className="msg-text">{m.text}</div>
              </div>
            ))}

            {remoteTyping && (
              <div className="message typing recv">
                <div className="msg-head">
                  <span className="msg-sender">System Bot</span>
                </div>
                <div className="msg-text typing-dots">
                  <span /> <span /> <span />
                </div>
              </div>
            )}

            <div ref={messagesRef} />
          </div>
        </div>

        <form className="panel-footer" onSubmit={handleSend}>
          <input
            aria-label="Type a message"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input"
          />
          <button type="submit" className="send-btn" title="Send">
            <Send size={16} />
          </button>
        </form>
      </aside>
    </>
  );
}
