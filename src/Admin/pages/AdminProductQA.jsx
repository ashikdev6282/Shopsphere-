// src/pages/admin/AdminProductQA.jsx
import React, { useEffect, useState } from "react";
import { fetchProducts } from "../../firebase/services/productService";
import {
  fetchQuestions,
  answerQuestion,
  deleteQuestion,
} from "../../firebase/services/productQAService";

import { ChevronDown, ChevronUp, Trash2, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminProductQA() {
  const [products, setProducts] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [questions, setQuestions] = useState({});
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingQ, setLoadingQ] = useState({});
  const [answerInputs, setAnswerInputs] = useState({}); // temp answers

  /* ---------------------------------------------------------
      Load all products first
  --------------------------------------------------------- */
  useEffect(() => {
    async function load() {
      try {
        setLoadingProduct(true);
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load products.");
      } finally {
        setLoadingProduct(false);
      }
    }
    load();
  }, []);

  /* ---------------------------------------------------------
     Expand product → fetch questions
  --------------------------------------------------------- */
  const toggleExpand = async (productId) => {
    const isOpen = expanded[productId];
    setExpanded({ ...expanded, [productId]: !isOpen });

    if (isOpen) return; // collapsing doesn't fetch

    try {
      setLoadingQ((prev) => ({ ...prev, [productId]: true }));
      const data = await fetchQuestions(productId);
      setQuestions((prev) => ({ ...prev, [productId]: data }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load questions.");
    } finally {
      setLoadingQ((prev) => ({ ...prev, [productId]: false }));
    }
  };

  /* ---------------------------------------------------------
      Handle answer submit
  --------------------------------------------------------- */
  const handleAnswer = async (productId, questionId) => {
    const text = answerInputs[questionId];
    if (!text || text.trim().length < 2) {
      toast.error("Please enter a valid answer.");
      return;
    }

    try {
      await answerQuestion(productId, questionId, text);
      toast.success("Answer saved!");

      // refresh list for this product
      const updated = await fetchQuestions(productId);
      setQuestions((prev) => ({ ...prev, [productId]: updated }));

      // clear input
      setAnswerInputs((prev) => ({ ...prev, [questionId]: "" }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update answer.");
    }
  };

  /* ---------------------------------------------------------
      Handle question delete
  --------------------------------------------------------- */
  const handleDelete = async (productId, questionId) => {
    const confirm = window.confirm("Delete this question?");
    if (!confirm) return;

    try {
      await deleteQuestion(productId, questionId);
      toast.success("Question deleted.");

      const updated = await fetchQuestions(productId);
      setQuestions((prev) => ({ ...prev, [productId]: updated }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete question.");
    }
  };

  /* ---------------------------------------------------------
      UI RENDER
  --------------------------------------------------------- */
  return (
    <div className="p-8 bg-gray-900 min-h-screen text-gray-100">
      <h1 className="text-4xl font-extrabold text-purple-400 mb-8 text-center">
        Product Q&A Management
      </h1>

      {loadingProduct ? (
        <p className="text-center text-gray-300">Loading products...</p>
      ) : products.length === 0 ? (
        <p class-name="text-center text-gray-400 italic">No products found.</p>
      ) : (
        <div className="space-y-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl"
            >
              {/* ---------------- PRODUCT HEADER ---------------- */}
              <button
                onClick={() => toggleExpand(product.id)}
                className="w-full flex justify-between items-center px-6 py-4 hover:bg-gray-700/50 transition text-left"
              >
                <div>
                  <h2 className="text-xl font-semibold text-pink-300">
                    {product.name}
                  </h2>
                  <p className="text-gray-400 text-sm">{product.category}</p>
                </div>

                {expanded[product.id] ? (
                  <ChevronUp className="text-gray-300" />
                ) : (
                  <ChevronDown className="text-gray-300" />
                )}
              </button>

              {/* ---------------- QUESTIONS PANEL ---------------- */}
              {expanded[product.id] && (
                <div className="px-6 pb-6 space-y-4">
                  {loadingQ[product.id] ? (
                    <p className="text-gray-400 py-4">Loading questions...</p>
                  ) : questions[product.id]?.length > 0 ? (
                    questions[product.id].map((q) => (
                      <div
                        key={q.id}
                        className="bg-gray-900 p-4 rounded-xl border border-gray-700"
                      >
                        <p className="text-gray-200 font-medium">{q.question}</p>
                        <p className="text-gray-500 text-sm">
                          Asked by: {q.userName || "Customer"}
                        </p>

                        {/* Existing Answer */}
                        {q.answered ? (
                          <div className="mt-3 bg-gray-800 p-3 rounded-lg border border-gray-600">
                            <p className="text-green-400 font-semibold mb-1">
                              Answer:
                            </p>
                            <p className="text-gray-300">{q.answer}</p>
                          </div>
                        ) : (
                          <p className="text-yellow-400 mt-2">
                            Awaiting answer…
                          </p>
                        )}

                        {/* Answer Input */}
                        <div className="mt-4 flex gap-2">
                          <input
                            type="text"
                            value={answerInputs[q.id] || ""}
                            onChange={(e) =>
                              setAnswerInputs((prev) => ({
                                ...prev,
                                [q.id]: e.target.value,
                              }))
                            }
                            placeholder={
                              q.answered ? "Update answer..." : "Write answer..."
                            }
                            className="flex-1 bg-gray-800 border border-gray-700 p-2 rounded-lg text-gray-200 outline-none"
                          />
                          <button
                            onClick={() =>
                              handleAnswer(product.id, q.id)
                            }
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white flex items-center gap-2"
                          >
                            <Send size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id, q.id)}
                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">No questions yet.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
