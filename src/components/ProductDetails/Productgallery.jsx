import React, { useState } from "react";

const images = [
  "/images/product1.jpg",
  "/images/product2.jpg",
  "/images/product3.jpg",
  "/images/product4.jpg",
];

export default function ProductGallery() {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="flex flex-col items-center">
      {/* Main Image */}
      <div className="w-full h-[400px] bg-gray-800 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg">
        <img
          src={selectedImage}
          alt="Product"
          className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-4 mt-6">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(img)}
            className={`w-20 h-20 rounded-xl overflow-hidden border-2 ${
              selectedImage === img ? "border-blue-500" : "border-gray-700"
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
