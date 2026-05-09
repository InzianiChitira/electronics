import { Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';

export default function Navbar() {
  const count = useCartStore(s => s.getCount());

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">⚡ Electronics</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-8">
          <Link 
            to="/" 
            className="text-gray-600 hover:text-primary font-medium transition"
          >
            Home
          </Link>
          <Link 
            to="/shop" 
            className="text-gray-600 hover:text-primary font-medium transition"
          >
            Shop
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className="relative">
            <div className="bg-primary text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-blue-700 transition">
              <span>🛒</span>
              <span className="font-medium">Cart</span>
              {count > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </div>
          </Link>
        </div>

      </div>
    </nav>
  );
}