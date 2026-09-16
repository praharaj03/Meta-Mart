'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import Link from 'next/link';
import { formatINR } from '@/lib/currency';

const CATEGORIES = ['All','Electronics','Wearables','Fashion','Home','Gaming','Photography','Books','Sports','Beauty','Kitchen','Travel'];

interface Product { _id: string; name: string; price: number; originalPrice: number; image: string; images?: string[]; description?: string; rating: number; reviews: number; category: string; badge: string; }
const PAGE_SIZE = 12;

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedCategory, setSelectedCategory] = useState(
    () => typeof window !== 'undefined' ? (sessionStorage.getItem('shop_category') ?? 'All') : 'All'
  );
  const [searchTerm, setSearchTerm] = useState(
    () => typeof window !== 'undefined' ? (sessionStorage.getItem('shop_search') ?? '') : ''
  );
  const [toast, setToast] = useState<{show: boolean, message: string}>({show: false, message: ''});
  const { addToCart } = useCart();
  const { toggle: toggleWishlist, has: inWishlist } = useWishlist();

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(data => setProducts(data.products ?? data)).catch(() => setProducts([]));
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product._id as any,
      name: product.name,
      price: product.price,
      image: product.image
    });
    setToast({show: true, message: `${product.name} added to cart!`});
    setTimeout(() => setToast({show: false, message: ''}), 3000);
  };

  const handleToggleWishlist = (product: Product) => {
    toggleWishlist({ id: product._id, name: product.name, price: product.price, originalPrice: product.originalPrice, image: product.image, category: product.category, badge: product.badge, rating: product.rating });
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const visibleProducts = filteredProducts.slice(0, visibleCount);
  useEffect(() => setVisibleCount(PAGE_SIZE), [selectedCategory, searchTerm]);

  const toggleFavorite = (product: Product) => handleToggleWishlist(product);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#08070d] pt-20">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-900 via-purple-700 to-indigo-900 text-white py-10 sm:py-16">
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
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); sessionStorage.setItem('shop_search', e.target.value); }}
                className="w-full pl-10 pr-4 py-3 border border-white/10 rounded-xl bg-[#13111b] text-white placeholder-zinc-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-[#13111b] border border-white/10 rounded-xl hover:bg-purple-500/20 transition-all duration-300 text-zinc-200">
              <FiFilter />
              Filters
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 animate-fade-in-up animation-delay-400">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => { setSelectedCategory(category); sessionStorage.setItem('shop_category', category); }}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white shadow-lg scale-105'
                    : 'bg-[#13111b] text-zinc-300 border border-white/10 hover:bg-purple-500/20 hover:scale-105'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.length === 0 && products.length === 0 && (
              <div className="col-span-3 text-center py-20 text-zinc-400">Loading products...</div>
            )}
            {visibleProducts.map((product, index) => (
              <div
                key={product._id}
                className="group bg-[#13111b] border border-white/10 rounded-2xl shadow-lg hover:shadow-2xl hover:border-purple-400/60 transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-2xl">
                  <Link href={`/products/${product._id}`} aria-label={`View ${product.name}`} className="block">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

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
                    onClick={() => toggleFavorite(product)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                  >
                      <FiHeart className={`w-5 h-5 ${inWishlist(product._id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                  </button>

                </div>

                {/* Product Info */}
                <div className="p-6">
                  <Link href={`/products/${product._id}`} className="block text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">{product.name}</Link>

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
                    <span className="text-2xl font-bold text-white">
<<<<<<< HEAD
                      {formatINR(product.price)}
                    </span>
                    <span className="text-lg text-zinc-500 line-through">
                      {formatINR(product.originalPrice)}
=======
                      Rs. {product.price}
                    </span>
                    <span className="text-lg text-zinc-500 line-through">
                      Rs. {product.originalPrice}
>>>>>>> f3e2978e5f10eb8e497081058d3395663a9ec890
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
          {visibleCount < filteredProducts.length && <div className="text-center mt-12">
            <button onClick={() => setVisibleCount(count => count + PAGE_SIZE)} className="px-8 py-4 bg-gradient-to-r from-purple-800 to-purple-900 text-white rounded-xl hover:from-purple-900 hover:to-indigo-900 transition-all duration-300 transform hover:scale-105 font-semibold">
              Load More Products
            </button>
          </div>}
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
