'use client';

import { useState } from 'react';
import { FiSearch, FiFilter, FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '../../context/CartContext';

const products = [
  // Electronics
  { id: 1, name: "Premium Wireless Headphones", price: 299.99, originalPrice: 399.99, image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.8, reviews: 124, category: "Electronics", badge: "Best Seller" },
  { id: 2, name: "Bluetooth Speaker", price: 89.99, originalPrice: 119.99, image: "https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.6, reviews: 98, category: "Electronics", badge: "Popular" },
  { id: 3, name: "Noise Cancelling Earbuds", price: 149.99, originalPrice: 199.99, image: "https://images.pexels.com/photos/8534088/pexels-photo-8534088.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.7, reviews: 211, category: "Electronics", badge: "New" },
  { id: 4, name: "Portable Power Bank", price: 49.99, originalPrice: 69.99, image: "https://images.pexels.com/photos/4526414/pexels-photo-4526414.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.5, reviews: 340, category: "Electronics", badge: "Popular" },
  { id: 5, name: "USB-C Hub 7-in-1", price: 59.99, originalPrice: 79.99, image: "https://images.pexels.com/photos/5082579/pexels-photo-5082579.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.4, reviews: 175, category: "Electronics", badge: "Sale" },
  // Wearables
  { id: 6, name: "Smart Fitness Watch", price: 199.99, originalPrice: 249.99, image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.6, reviews: 89, category: "Wearables", badge: "New" },
  { id: 7, name: "Heart Rate Monitor Band", price: 79.99, originalPrice: 99.99, image: "https://images.pexels.com/photos/4498482/pexels-photo-4498482.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.3, reviews: 132, category: "Wearables", badge: "Popular" },
  { id: 8, name: "GPS Sports Watch", price: 249.99, originalPrice: 319.99, image: "https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.7, reviews: 76, category: "Wearables", badge: "Pro" },
  { id: 9, name: "Sleep Tracker Ring", price: 129.99, originalPrice: 159.99, image: "https://images.pexels.com/photos/9978722/pexels-photo-9978722.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.5, reviews: 54, category: "Wearables", badge: "New" },
  // Fashion
  { id: 10, name: "Organic Cotton T-Shirt", price: 29.99, originalPrice: 39.99, image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.7, reviews: 156, category: "Fashion", badge: "Eco-Friendly" },
  { id: 11, name: "Slim Fit Chino Pants", price: 59.99, originalPrice: 79.99, image: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.5, reviews: 203, category: "Fashion", badge: "Popular" },
  { id: 12, name: "Leather Crossbody Bag", price: 89.99, originalPrice: 119.99, image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.6, reviews: 88, category: "Fashion", badge: "Trending" },
  { id: 13, name: "Classic Denim Jacket", price: 79.99, originalPrice: 109.99, image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.8, reviews: 267, category: "Fashion", badge: "Best Seller" },
  { id: 14, name: "Running Sneakers", price: 119.99, originalPrice: 149.99, image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.7, reviews: 412, category: "Fashion", badge: "Popular" },
  { id: 15, name: "Wool Blend Scarf", price: 34.99, originalPrice: 49.99, image: "https://images.pexels.com/photos/45055/pexels-photo-45055.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.4, reviews: 91, category: "Fashion", badge: "Sale" },
  // Home
  { id: 16, name: "Minimalist Desk Lamp", price: 79.99, originalPrice: 99.99, image: "https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.5, reviews: 203, category: "Home", badge: "Popular" },
  { id: 17, name: "Scented Soy Candle Set", price: 39.99, originalPrice: 54.99, image: "https://images.pexels.com/photos/3270223/pexels-photo-3270223.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.8, reviews: 318, category: "Home", badge: "Best Seller" },
  { id: 18, name: "Ceramic Plant Pot Set", price: 44.99, originalPrice: 59.99, image: "https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.6, reviews: 145, category: "Home", badge: "Trending" },
  { id: 19, name: "Bamboo Cutting Board", price: 29.99, originalPrice: 39.99, image: "https://images.pexels.com/photos/4397899/pexels-photo-4397899.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.7, reviews: 229, category: "Home", badge: "Eco-Friendly" },
  { id: 20, name: "Throw Pillow Cover Set", price: 24.99, originalPrice: 34.99, image: "https://images.pexels.com/photos/1248583/pexels-photo-1248583.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.5, reviews: 187, category: "Home", badge: "Sale" },
  { id: 21, name: "Wall Clock Modern", price: 54.99, originalPrice: 74.99, image: "https://images.pexels.com/photos/1095601/pexels-photo-1095601.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.4, reviews: 112, category: "Home", badge: "Popular" },
  // Gaming
  { id: 22, name: "Gaming Mechanical Keyboard", price: 149.99, originalPrice: 199.99, image: "https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.8, reviews: 312, category: "Gaming", badge: "Gaming" },
  { id: 23, name: "RGB Gaming Mouse", price: 69.99, originalPrice: 89.99, image: "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.7, reviews: 445, category: "Gaming", badge: "Best Seller" },
  { id: 24, name: "Gaming Headset 7.1", price: 99.99, originalPrice: 129.99, image: "https://images.pexels.com/photos/3945659/pexels-photo-3945659.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.6, reviews: 278, category: "Gaming", badge: "Popular" },
  { id: 25, name: "Gaming Chair Pro", price: 349.99, originalPrice: 449.99, image: "https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.5, reviews: 134, category: "Gaming", badge: "Pro" },
  { id: 26, name: "Controller Charging Dock", price: 34.99, originalPrice: 49.99, image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.4, reviews: 198, category: "Gaming", badge: "New" },
  // Photography
  { id: 27, name: "Professional Camera Lens", price: 899.99, originalPrice: 1099.99, image: "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.9, reviews: 67, category: "Photography", badge: "Pro" },
  { id: 28, name: "Camera Tripod Flexible", price: 49.99, originalPrice: 69.99, image: "https://images.pexels.com/photos/1787235/pexels-photo-1787235.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.5, reviews: 223, category: "Photography", badge: "Popular" },
  { id: 29, name: "Camera Shoulder Bag", price: 69.99, originalPrice: 89.99, image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.6, reviews: 156, category: "Photography", badge: "Trending" },
  { id: 30, name: "ND Filter Set 77mm", price: 79.99, originalPrice: 109.99, image: "https://images.pexels.com/photos/3497065/pexels-photo-3497065.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.7, reviews: 88, category: "Photography", badge: "Pro" },
  // Books
  { id: 31, name: "The Art of Thinking Clearly", price: 14.99, originalPrice: 19.99, image: "https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.8, reviews: 512, category: "Books", badge: "Best Seller" },
  { id: 32, name: "Atomic Habits", price: 16.99, originalPrice: 24.99, image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.9, reviews: 1024, category: "Books", badge: "Best Seller" },
  { id: 33, name: "Deep Work", price: 13.99, originalPrice: 18.99, image: "https://images.pexels.com/photos/256431/pexels-photo-256431.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.7, reviews: 678, category: "Books", badge: "Popular" },
  { id: 34, name: "Sapiens: A Brief History", price: 17.99, originalPrice: 22.99, image: "https://images.pexels.com/photos/694740/pexels-photo-694740.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.8, reviews: 890, category: "Books", badge: "Trending" },
  // Sports
  { id: 35, name: "Yoga Mat Premium", price: 49.99, originalPrice: 69.99, image: "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.7, reviews: 334, category: "Sports", badge: "Popular" },
  { id: 36, name: "Resistance Bands Set", price: 24.99, originalPrice: 34.99, image: "https://images.pexels.com/photos/4162487/pexels-photo-4162487.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.6, reviews: 445, category: "Sports", badge: "Best Seller" },
  { id: 37, name: "Adjustable Dumbbell 20kg", price: 129.99, originalPrice: 169.99, image: "https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.8, reviews: 212, category: "Sports", badge: "Pro" },
  { id: 38, name: "Cycling Water Bottle", price: 19.99, originalPrice: 27.99, image: "https://images.pexels.com/photos/3621185/pexels-photo-3621185.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.5, reviews: 567, category: "Sports", badge: "Eco-Friendly" },
  { id: 39, name: "Jump Rope Speed", price: 14.99, originalPrice: 19.99, image: "https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.4, reviews: 289, category: "Sports", badge: "Sale" },
  // Beauty
  { id: 40, name: "Vitamin C Serum", price: 34.99, originalPrice: 49.99, image: "https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.8, reviews: 723, category: "Beauty", badge: "Best Seller" },
  { id: 41, name: "Jade Facial Roller", price: 22.99, originalPrice: 32.99, image: "https://images.pexels.com/photos/3997993/pexels-photo-3997993.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.6, reviews: 398, category: "Beauty", badge: "Trending" },
  { id: 42, name: "Hydrating Face Mask Set", price: 27.99, originalPrice: 39.99, image: "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.7, reviews: 512, category: "Beauty", badge: "Popular" },
  { id: 43, name: "Natural Lip Balm Pack", price: 12.99, originalPrice: 17.99, image: "https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.5, reviews: 634, category: "Beauty", badge: "Eco-Friendly" },
  // Food & Kitchen
  { id: 44, name: "Pour Over Coffee Set", price: 44.99, originalPrice: 59.99, image: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.8, reviews: 445, category: "Kitchen", badge: "Best Seller" },
  { id: 45, name: "Cast Iron Skillet 10\"" , price: 59.99, originalPrice: 79.99, image: "https://images.pexels.com/photos/4253312/pexels-photo-4253312.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.9, reviews: 678, category: "Kitchen", badge: "Pro" },
  { id: 46, name: "Stainless Steel Knife Set", price: 89.99, originalPrice: 119.99, image: "https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.7, reviews: 334, category: "Kitchen", badge: "Popular" },
  { id: 47, name: "Reusable Beeswax Wraps", price: 18.99, originalPrice: 24.99, image: "https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.6, reviews: 289, category: "Kitchen", badge: "Eco-Friendly" },
  // Travel
  { id: 48, name: "Hardshell Carry-On Luggage", price: 149.99, originalPrice: 199.99, image: "https://images.pexels.com/photos/2249959/pexels-photo-2249959.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.7, reviews: 223, category: "Travel", badge: "Popular" },
  { id: 49, name: "Packing Cube Set 6pc", price: 29.99, originalPrice: 39.99, image: "https://images.pexels.com/photos/1282316/pexels-photo-1282316.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.6, reviews: 445, category: "Travel", badge: "Best Seller" },
  { id: 50, name: "Travel Neck Pillow", price: 24.99, originalPrice: 34.99, image: "https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg?auto=compress&cs=tinysrgb&w=600", rating: 4.5, reviews: 567, category: "Travel", badge: "Popular" },
];

const categories = ["All", "Electronics", "Wearables", "Fashion", "Home", "Gaming", "Photography", "Books", "Sports", "Beauty", "Kitchen", "Travel"];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [toast, setToast] = useState<{show: boolean, message: string}>({show: false, message: ''});
  const { addToCart } = useCart();

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
    setToast({show: true, message: `${product.name} added to cart!`});
    setTimeout(() => setToast({show: false, message: ''}), 3000);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (productId: number) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-5xl font-bold mb-4 animate-fade-in-up">
              Discover Amazing Products
            </h1>
            <p className="text-base sm:text-xl opacity-90 animate-fade-in-up animation-delay-200">
              Premium quality, unbeatable prices
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in-up animation-delay-300">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-black"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 text-black">
              <FiFilter />
              Filters
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 animate-fade-in-up animation-delay-400">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-100 hover:scale-105'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-2xl">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />

                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.badge === 'Best Seller' ? 'bg-red-500 text-white' :
                      product.badge === 'New' ? 'bg-green-500 text-white' :
                      product.badge === 'Pro' ? 'bg-purple-500 text-white' :
                      'bg-blue-500 text-white'
                    }`}>
                      {product.badge}
                    </span>
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                  >
                    <FiHeart
                      className={`w-5 h-5 ${
                        favorites.includes(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'
                      }`}
                    />
                  </button>

                  {/* Quick Add to Cart */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300"
                    >
                      <FiShoppingCart className="w-4 h-4" />
                      Quick Add
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-gray-800">
                      ${product.price}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                    <span className="text-sm text-green-600 font-semibold">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:from-gray-900 hover:to-black transition-all duration-300 transform hover:scale-105 font-semibold">
              Load More Products
            </button>
          </div>
        </div>
      </div>
      
      {/* Toast Notification */}
      {toast.show && (
        <div className="toast-notification">
          <div className="toast-content">
            <svg className="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
      
      <Footer />

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }
        
        .toast-notification {
          position: fixed;
          top: 100px;
          right: 20px;
          z-index: 1000;
          animation: slideInRight 0.3s ease-out;
        }
        
        .toast-content {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #10b981;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          font-weight: 500;
        }
        
        .toast-icon {
          flex-shrink: 0;
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
