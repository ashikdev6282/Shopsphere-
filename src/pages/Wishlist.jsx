import { useDispatch, useSelector } from "react-redux";
import { HeartOff } from "lucide-react";
import { removeFromWishlistFS } from "../firebase/services/wishlistService";
import { removeWishlistItem } from "../redux/wishlistSlice";
import toast from "react-hot-toast";

/* ---------------- Skeleton Card ---------------- */
const WishlistSkeleton = () => {
  return (
    <div className="bg-gray-800 rounded-xl p-4 shadow-lg animate-pulse">
      <div className="h-56 w-full bg-gray-700 rounded-lg" />
      <div className="mt-4 h-5 w-3/4 bg-gray-700 rounded" />
      <div className="mt-2 h-4 w-1/3 bg-gray-700 rounded" />
      <div className="mt-4 h-4 w-24 bg-gray-700 rounded" />
    </div>
  );
};

export default function Wishlist() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items: wishlist, loading } = useSelector((s) => s.wishlist);

  /* 🔐 Safety: user might be null briefly */
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Please login to view your wishlist
      </div>
    );
  }

  const handleRemove = async (id) => {
    try {
      await removeFromWishlistFS(user.uid, id);
      dispatch(removeWishlistItem(id));
      toast.success("Removed from wishlist");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
    }
  };

  /* 🔄 Loading State */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white px-6 py-12">
        <h1 className="text-3xl font-bold mb-8 text-pink-500">
          ❤️ My Wishlist
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <WishlistSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  /* 🪹 Empty State */
  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-400 gap-4">
        <span className="text-5xl">💔</span>
        <p className="text-lg">Your wishlist is empty</p>
        <p className="text-sm text-gray-500">
          Browse products and tap ❤️ to save items
        </p>
      </div>
    );
  }

  /* ✅ Wishlist Items */
  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-pink-500">
        ❤️ My Wishlist
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {wishlist.map((product) => (
          <div
            key={product.id}
            className="bg-gray-800 rounded-xl p-4 shadow-lg hover:scale-[1.02] transition"
          >
            <img
              src={product.image || "/images/fallback.jpg"}
              alt={product.name}
              className="h-56 w-full object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = "/images/fallback.jpg";
              }}
            />

            <h3 className="mt-4 font-semibold text-lg">
              {product.name}
            </h3>

            <p className="text-pink-400 font-bold">
              ${product.price}
            </p>

            <button
              onClick={() => handleRemove(product.id)}
              className="mt-4 flex items-center gap-2 text-red-400 hover:text-red-500"
            >
              <HeartOff size={18} /> Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
