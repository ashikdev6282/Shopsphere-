import React from "react";
import { useSelector } from "react-redux";
import { FaUser, FaBox, FaHeart, FaBell, FaStar, FaMapMarkerAlt } from "react-icons/fa";

const ProfilePage = () => {
  const user = useSelector((state) => state.user?.user);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-gray-100">
        <p className="text-lg text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-gray-100 py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar: Profile Card */}
        <div className="shadow-md rounded-2xl p-6 flex flex-col items-center bg-gradient-to-b from-gray-700 via-black to-gray-600 text-gray-100">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-28 h-28 rounded-full border-4 border-red-600 shadow-lg"
          />
          <h2 className="mt-4 text-2xl font-semibold text-gray-900">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-600">{user.phone}</p>
          <p className="text-gray-600 text-center">{user.address}</p>
          <Button className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
            Edit Profile
          </Button>
        </div>

        {/* Right Content: Info Sections */}
        <div className="lg:col-span-2 space-y-8">
          {/* Account Summary */}
          <div className="bg-white shadow-md rounded-2xl p-6 bg-gradient-to-b from-gray-900 via-black to-gray-900 text-gray-100">
            <h3 className="text-xl font-semibold  bg-gradient-to-r from-indigo-400 via-pink-500 to-pink-500 bg-clip-text text-transparent mb-4">Account Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="flex flex-col items-center">
                <FaBox className="text-red-600 text-3xl mb-2" />
                <p className="font-semibold text-white-800">{user.orders}</p>
                <p className="text-sm bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">Orders</p>
              </div>
              <div className="flex flex-col items-center">
                <FaHeart className="text-red-500 text-3xl mb-2" />
                <p className="font-semibold text-white-800">{user.wishlist}</p>
                <p className="text-sm  bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">Wishlist</p>
              </div>
              <div className="flex flex-col items-center">
                <FaStar className="text-red-400 text-3xl mb-2" />
                <p className="font-semibold text-white-800">8</p>
                <p className="text-sm  bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">Reviews</p>
              </div>
              <div className="flex flex-col items-center">
                <FaBell className="text-red-500 text-3xl mb-2" />
                <p className="font-semibold text-white-800">3</p>
                <p className="text-sm bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">Notifications</p>
              </div>
            </div>
          </div>

          {/* Manage Addresses */}
          <div className="bg-white shadow-md rounded-2xl p-6 bg-gradient-to-b from-gray-900 via-black to-gray-900 text-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
                <FaMapMarkerAlt className="text-pink-600" /> Manage Addresses
              </h3>
              <button className=" bg-gradient-to-r from-indigo-400 to-pink-500 text-black px-3 py-1 rounded-lg">
                + Add Address
              </button>
            </div>
            <div className="space-y-4">
              <div className="border p-4 rounded-lg">
                <p className="font-semibold bg-gradient-to-r from-indigo-400 via-pink-600 to-pink-600 bg-clip-text text-transparent">Home</p>
                <p className="text-gray-600">Thrissur, Kerala, India</p>
                <div className="mt-2 flex gap-3">
                  <button className="text-red-600 hover:underline">Edit</button>
                  <button className="text-gray-500 hover:underline">Remove</button>
                </div>
              </div>
              <div className="border p-4 rounded-lg">
                <p className="font-semibold bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">Work</p>
                <p className="text-gray-600">Kochi, Kerala, India</p>
                <div className="mt-2 flex gap-3">
                  <button className="text-red-600 hover:underline">Edit</button>
                  <button className="text-gray-500 hover:underline">Remove</button>
                </div>
              </div>
            </div>
          </div>

          {/* My Stuff */}
          <div className="bg-white shadow-md rounded-2xl p-6 bg-gradient-to-b from-gray-900 via-black to-gray-900">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent mb-4">My Stuff</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-red-50 cursor-pointer">
                <FaStar className="text-red-500 text-3xl mb-2" />
                <p className="font-semibold bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">My Reviews</p>
              </div>
              <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-red-50 cursor-pointer">
                <FaHeart className="text-red-600 text-3xl mb-2" />
                <p className="font-semibold bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">Wishlist</p>
              </div>
              <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-red-50 cursor-pointer">
                <FaBell className="text-red-500 text-3xl mb-2" />
                <p className="font-semibold bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">Notifications</p>
              </div>
              <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-red-50 cursor-pointer">
                <FaBox className="text-red-600 text-3xl mb-2" />
                <p className="font-semibold bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">My Orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Button = ({ children, className }) => (
  <button className={`px-4 py-2 rounded-lg font-medium ${className}`}>
    {children}
  </button>
);

export default ProfilePage; 
