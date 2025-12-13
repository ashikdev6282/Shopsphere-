// src/components/ProductDetails/ProductQA.jsx

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  fetchQuestions,
  addQuestion,
} from "../../firebase/services/productQAService";

import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function ProductQA({ product }) {
  const user = useSelector((s) => s.auth?.user);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [questionText, setQuestionText] = useState("");

  // 🔥 Load questions when product loads
  useEffect(() => {
    if (!product) return;

    let cancelled = false;

    (async () => {
      try {
        const data = await fetchQuestions(product.id);
        if (!cancelled) setQuestions(data);
      } catch (err) {
        console.error("Q&A fetch error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [product]);

  /* ============================================================
      Customer submits new question
    ============================================================ */
  const handleSubmitQuestion = async () => {
    if (!user) {
      toast.error("You must be logged in to ask questions.");
      return;
    }

    if (!questionText.trim()) {
      toast.error("Please write a question.");
      return;
    }

    try {
      // Optimistic UI: show question immediately
      const temp = {
        id: `temp-${Date.now()}`,
        question: questionText,
        userName: user.displayName || "Customer",
        userId: user.uid,
        answer: "",
        answered: false,
        createdAt: new Date(),
      };

      setQuestions((prev) => [temp, ...prev]);
      setQuestionText("");

      const saved = await addQuestion(
        product.id,
        questionText,
        user.uid,
        user.displayName
      );

      // Replace temp with saved doc
      setQuestions((prev) =>
        prev.map((q) => (q.id === temp.id ? saved : q))
      );

      toast.success("Your question has been posted.");
    } catch (err) {
      console.error("Error adding question:", err);
      toast.error("Failed to submit question.");
    }
  };

  /* ============================================================
      UI
    ============================================================ */
  if (!product) {
    return <p className="text-gray-400">Product not found.</p>;
  }

  return (
    <div className="mt-6 space-y-6" id="qa-section">
      <h3 className="text-2xl font-semibold text-white mb-4">Customer Q&A</h3>

      {/* Ask a Question */}
      <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
        <textarea
          placeholder="Ask a question about this product..."
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="w-full bg-gray-900 text-gray-200 p-3 rounded-lg outline-none h-24 resize-none border border-gray-700"
        />
        <button
          onClick={handleSubmitQuestion}
          className="mt-3 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
        >
          Post Question
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-400">Loading questions...</p>
        ) : questions.length === 0 ? (
          <p className="text-gray-400 italic">
            No questions yet — be the first to ask something!
          </p>
        ) : (
          questions.map((q, index) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-800 p-4 rounded-xl border border-gray-700"
            >
              <p className="text-gray-200 font-medium">{q.question}</p>
              <p className="text-gray-500 text-sm mt-1">
                Asked by {q.userName || "Customer"}
              </p>

              {q.answered ? (
                <div className="mt-3 bg-gray-900 p-3 rounded-lg border border-gray-700">
                  <p className="text-green-400 font-semibold mb-1">Answer:</p>
                  <p className="text-gray-300">{q.answer}</p>
                </div>
              ) : (
                <p className="text-yellow-400 text-sm mt-2">
                  (Awaiting admin answer)
                </p>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
