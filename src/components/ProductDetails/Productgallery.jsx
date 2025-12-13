import React, { useState, useEffect } from "react";

export default function ProductGallery({ product }) {
  // Support both a single image or an array of images
  const imageList = Array.isArray(product.images)
    ? product.images
    : product.image
    ? [product.image]
    : ["/images/fallback.jpg"];

  const [selectedImage, setSelectedImage] = useState(imageList[0]);

  useEffect(() => {
    // Reset selected image whenever the product changes
    setSelectedImage(imageList[0]);
  }, [product]);

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
      {imageList.length > 1 && (
        <div className="flex gap-4 mt-6">
          {imageList.map((img, idx) => (
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
      )}
    </div>
  );
}
