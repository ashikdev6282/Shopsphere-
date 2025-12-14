import React, { useState, useEffect, useRef } from "react";
import "./usersupportchat.css";
import { FiSend, FiMessageSquare, FiX } from "react-icons/fi";

const UserSupportChat = ({ user }) => {
  // Safe user ID (Firebase or Redux)
  const userId = user?.id || user?.uid || null;

  // If user not logged in → do NOT show chat
  if (!userId) return null;

  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`chat_${userId}`)) || [];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedMessages = [...messages, newMessage];

    setMessages(updatedMessages);
    localStorage.setItem(`chat_${userId}`, JSON.stringify(updatedMessages));
    setInput("");

    // Fake admin reply
    setIsTyping(true);
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        sender: "admin",
        text: "Thank you! Support will reply shortly.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const newChat = [...updatedMessages, reply];
      setMessages(newChat);
      localStorage.setItem(`chat_${userId}`, JSON.stringify(newChat));
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="support-chat-wrapper">

      <button
        className={`chat-toggle-btn ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX size={20} /> : <FiMessageSquare size={22} />}
      </button>

      {isOpen && (
        <div className="chat-box glass-card">
          <div className="chat-header">
            <span>💬 Support Chat</span>
          </div>

          <div className="chat-body">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-msg ${msg.sender}`}>
                <div className="msg-text">{msg.text}</div>
                <div className="msg-time">{msg.time}</div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-msg admin typing-indicator">
                <div className="msg-text">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={input}
              placeholder="Type your message..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>
              <FiSend />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSupportChat;
