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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories().then(r => r.data),
  });

  return (
    <header className="sticky top-0 z-50">

      {/* Top Bar — hidden on mobile */}
      <div className="bg-dark text-gray-300 text-xs py-2 hidden md:block">
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
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden flex flex-col gap-1 p-2 flex-shrink-0"
          >
            <span className={`block w-5 h-0.5 bg-dark transition-all duration-300 ${showMobileMenu ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block w-5 h-0.5 bg-dark transition-all duration-300 ${showMobileMenu ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-dark transition-all duration-300 ${showMobileMenu ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="text-xl md:text-2xl font-bold text-dark">
              ⚡ <span className="text-primary">Electronics</span>
            </span>
          </Link>

          {/* Category Dropdown — desktop only */}
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

          {/* Live Search — desktop */}
          <div className="hidden md:flex flex-1">
            <LiveSearch />
          </div>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 text-gray-400 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            Search...
          </button>

          {/* Cart Button */}
          <button
            onClick={openCart}
            className="relative flex-shrink-0 flex items-center gap-2 border-2 border-primary text-primary px-3 md:px-4 py-2 rounded-xl hover:bg-primary hover:text-white transition font-medium"
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

        {/* Mobile Search Bar — expands below navbar */}
        {showMobileSearch && (
          <div className="md:hidden px-4 pb-3">
            <LiveSearch />
          </div>
        )}
      </div>

      {/* Bottom Nav — desktop */}
      <div className="bg-dark text-white hidden md:block">
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

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t shadow-lg">

          {/* Mobile Top Bar Info */}
          <div className="bg-dark text-gray-300 text-xs px-4 py-2">
            Welcome to Juancogroup Electronics | Call 0700 000 000
          </div>

          {/* Nav Links */}
          <div className="px-4 py-2">
            <Link
              to="/"
              onClick={() => setShowMobileMenu(false)}
              className="flex items-center gap-3 py-3 border-b text-dark font-medium hover:text-primary transition"
            >
              🏠 Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setShowMobileMenu(false)}
              className="flex items-center gap-3 py-3 border-b text-dark font-medium hover:text-primary transition"
            >
              🛍️ Shop
            </Link>
            <Link
              to="/cart"
              onClick={() => setShowMobileMenu(false)}
              className="flex items-center gap-3 py-3 border-b text-dark font-medium hover:text-primary transition"
            >
              🛒 Cart {count > 0 && <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{count}</span>}
            </Link>
          </div>

          {/* Categories */}
          {categories?.filter(c => c.count > 0).length > 0 && (
            <div className="px-4 pb-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2 mt-2">
                Categories
              </p>
              <div className="grid grid-cols-2 gap-2">
                {categories.filter(c => c.count > 0).map(cat => (
                  <Link
                    key={cat.id}
                    to={`/shop?category=${cat.id}`}
                    onClick={() => setShowMobileMenu(false)}
                    className="bg-gray-50 rounded-xl px-3 py-2 text-sm text-dark hover:bg-primary hover:text-white transition"
                  >
                    {cat.name}
                    <span className="text-xs opacity-60 ml-1">({cat.count})</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between text-sm">
            <a href="tel:+254700000000" className="text-primary font-semibold">
              📞 0700 000 000
            </a>
            <a href="mailto:info@juancogroup.co.ke" className="text-gray-500">
              ✉️ info@juancogroup.co.ke
            </a>
          </div>

        </div>
      )}

    </header>
  );
}