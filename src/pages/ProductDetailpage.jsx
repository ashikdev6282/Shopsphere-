import React from "react";
import ProductGallery from "../components/ProductDetails/Productgallery";
import ProductInfo from "../components/ProductDetails/Productinfo";
import ProductTabs from "../components/ProductDetails/ProductTabs";
import ProductReviews from "../components/ProductDetails/ProductReviews";
import { useParams } from "react-router-dom";


const products = [
  { id: 1, name: 'Red Gown', category: 'Dress', price: 120, image: '/images/red-gown.jpg', desc: 'Elegant evening gown' },
  { id: 2, name: 'Floral Skirt', category: 'Dress', price: 80, image: '/images/floral-skirt.jpg', desc: 'Light and breezy skirt' },
  { id: 3, name: 'Men Formal Suit', category: 'Dress', price: 150, image: '/images/formal-suit.jpg', desc: 'Classic business suit' },
  { id: 4, name: 'Smartphone', category: 'Electronics', price: 699, image: '/images/phone.jpg', desc: 'Latest model with 5G' },
  { id: 5, name: 'Smartwatch', category: 'Electronics', price: 199, image: '/images/watch.jpg', desc: 'Tracks health & fitness' },
  { id: 6, name: 'Bluetooth Speaker', category: 'Electronics', price: 99, image: '/images/speaker.jpg', desc: 'Portable and powerful sound' },
  { id: 7, name: 'Leather Bag', category: 'Accessories', price: 89, image: '/images/bag.jpg', desc: 'Stylish and spacious' },
  { id: 8, name: 'Sunglasses', category: 'Accessories', price: 59, image: '/images/sunglasses.jpg', desc: 'UV protection lenses' },
  { id: 9, name: 'Bracelet Set', category: 'Accessories', price: 39, image: '/images/bracelet.jpg', desc: 'Chic everyday wear' },
  { id: 10, name: 'Wall Art', category: 'Home Decor', price: 75, image: '/images/wallart.jpg', desc: 'Modern abstract painting' },
  { id: 11, name: 'Cushion Set', category: 'Home Decor', price: 45, image: '/images/cushion.jpg', desc: 'Soft decorative cushions' },
  { id: 12, name: 'Table Lamp', category: 'Home Decor', price: 60, image: '/images/lamp.jpg', desc: 'Warm ambient lighting' },
];

export default function ProductDetailsPage() {
    const { id } = useParams();
    const product = products.find(p => p.id === parseInt(id));
    if (!product) {
        return <div className="text-center sm:text-3xl font-bold px-6 sm:px-0 sm:pt-12 sm:pb-6 py-20 text-gray-300">Product not found.</div>;
    }
  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      {/* Product Section */}
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Gallery */}
        <ProductGallery product={product} />

        {/* Right: Info */}
        <ProductInfo product={product} />
      </div>

      {/* Tabs (Description / Specs / Reviews) */}
      <div className="container mx-auto px-6">
        <ProductTabs product={product} />
      </div>

      {/* Related Products */}
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <ProductReviews product={product} />
      </div>
    </div>
  );
}
