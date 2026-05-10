import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../api/woocommerce';
import useCartStore from '../store/cartStore';

export default function Navbar() {
  const count = useCartStore(s => s.getCount());
  const [showCategories, setShowCategories] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories().then(r => r.data),
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?search=${search}`);
      setSearch('');
    }
  };

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
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
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

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 flex">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for products..."
              className="flex-1 border border-gray-200 rounded-l-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <button
              type="submit"
              className="bg-primary text-white px-5 py-2 rounded-r-xl hover:bg-blue-700 transition"
            >
              🔍
            </button>
          </form>

          {/* Cart */}
          <Link to="/cart" className="relative flex-shrink-0">
            <div className="flex items-center gap-2 border-2 border-primary text-primary px-4 py-2 rounded-xl hover:bg-primary hover:text-white transition font-medium">
              <span className="text-xl">🛒</span>
              <div className="hidden md:block text-sm">
                <p className="text-xs text-gray-400 leading-none">Your Cart</p>
                <p className="font-bold leading-none">{count} items</p>
              </div>
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </div>
          </Link>

        </div>
      </div>

      {/* Bottom Nav Links */}
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