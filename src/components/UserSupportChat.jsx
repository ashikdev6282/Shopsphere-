import React, { useState, useEffect, useRef } from "react";
import "./usersupportchat.css";
import { FiSend, FiMessageSquare, FiX } from "react-icons/fi";

const UserSupportChat = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem(`chat_${user.id}`)) || []
  );
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new messages
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
    localStorage.setItem(`chat_${user.id}`, JSON.stringify(updatedMessages));
    setInput("");

    // Simulate admin typing + response
    setIsTyping(true);
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        sender: "admin",
        text: "Thanks for reaching out! We'll respond shortly.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      const newChat = [...updatedMessages, reply];
      setMessages(newChat);
      localStorage.setItem(`chat_${user.id}`, JSON.stringify(newChat));
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="support-chat-wrapper">
      {/* Floating button */}
      <button
        className={`chat-toggle-btn ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX size={20} /> : <FiMessageSquare size={22} />}
      </button>

      {/* Chat box */}
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
