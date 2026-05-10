import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../api/woocommerce';
import useCartStore from '../store/cartStore';
import useCartSidebarStore from '../store/cartSidebarStore';
import LiveSearch from './LiveSearch';

export default function Navbar() {
  const count = useCartStore(s => s.getCount());
  const openCart = useCartSidebarStore(s => s.open);
  const [showCategories, setShowCategories] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories().then(r => r.data),
  });

  return (
    <header className="sticky top-0 z-50">

      {/* Top Bar */}
      <div className="bg-dark text-gray-300 text-xs py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span>Welcome to Juancogroup Electronics | Call 0700 000 000</span>
          <div className="flex gap-4">
            <Link to="/shop" className="hover:text-white transition">Shop</Link>
            <Link to="/cart" className="hover:text-white transition">Cart</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="text-2xl font-bold text-dark">
              ⚡ <span className="text-primary">Electronics</span>
            </span>
          </Link>

          {/* Category Dropdown */}
          <div className="relative hidden md:block flex-shrink-0">
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition text-sm"
            >
              ☰ All Categories
              <span className="text-xs">{showCategories ? '▲' : '▼'}</span>
            </button>
            {showCategories && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white shadow-xl rounded-xl border z-50 overflow-hidden">
                <Link
                  to="/shop"
                  onClick={() => setShowCategories(false)}
                  className="block px-4 py-3 hover:bg-blue-50 hover:text-primary transition text-sm font-medium border-b"
                >
                  All Products
                </Link>
                {categories?.filter(c => c.count > 0).map(cat => (
                  <Link
                    key={cat.id}
                    to={`/shop?category=${cat.id}`}
                    onClick={() => setShowCategories(false)}
                    className="block px-4 py-3 hover:bg-blue-50 hover:text-primary transition text-sm"
                  >
                    {cat.name}
                    <span className="text-gray-400 text-xs ml-1">({cat.count})</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Live Search */}
          <LiveSearch />

          {/* Cart Button */}
          <button
            onClick={openCart}
            className="relative flex-shrink-0 flex items-center gap-2 border-2 border-primary text-primary px-4 py-2 rounded-xl hover:bg-primary hover:text-white transition font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div className="hidden md:block text-sm">
              <p className="text-xs leading-none opacity-70">Your Cart</p>
              <p className="font-bold leading-none">{count} items</p>
            </div>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {count}
              </span>
            )}
          </button>

        </div>
      </div>

      {/* Bottom Nav */}
      <div className="bg-dark text-white">
        <div className="max-w-7xl mx-auto px-4 py-2 flex gap-6 text-sm overflow-x-auto">
          <Link to="/" className="hover:text-primary transition whitespace-nowrap font-medium">Home</Link>
          <Link to="/shop" className="hover:text-primary transition whitespace-nowrap">Shop</Link>
          {categories?.filter(c => c.count > 0).slice(0, 6).map(cat => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className="hover:text-primary transition whitespace-nowrap"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

    </header>
  );
}