import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="md:col-span-1">
          <h3 className="text-white text-2xl font-bold mb-4">
            ⚡ <span className="text-primary">Electronics</span>
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Your one-stop shop for premium electronics at unbeatable prices. Fast delivery across Kenya.
          </p>
          <div className="flex gap-3 mt-6">
            <a href="#" className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition text-sm">f</a>
            <a href="#" className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition text-sm">in</a>
            <a href="#" className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center hover:bg-mpesa transition text-sm">w</a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-lg">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/" className="hover:text-white hover:translate-x-1 transition inline-block">→ Home</Link></li>
            <li><Link to="/shop" className="hover:text-white hover:translate-x-1 transition inline-block">→ Shop</Link></li>
            <li><Link to="/cart" className="hover:text-white hover:translate-x-1 transition inline-block">→ Cart</Link></li>
            <li><Link to="/checkout" className="hover:text-white hover:translate-x-1 transition inline-block">→ Checkout</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-lg">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span>📞</span>
              <a href="tel:+254700000000" className="hover:text-white transition">+254 700 000 000</a>
            </li>
            <li className="flex items-start gap-2">
              <span>✉️</span>
              <a href="mailto:info@juancogroup.co.ke" className="hover:text-white transition">info@juancogroup.co.ke</a>
            </li>
            <li className="flex items-start gap-2">
              <span>📍</span>
              <span>Nairobi, Kenya</span>
            </li>
            <li className="flex items-start gap-2">
              <span>🕐</span>
              <span>Mon - Sat: 8am - 7pm</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-lg">Newsletter</h4>
          <p className="text-sm text-gray-400 mb-4">Get deals and updates directly in your inbox.</p>
          <div className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-gray-500"
            />
            <button className="bg-primary text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
              Subscribe
            </button>
          </div>
        </div>

      </div>

      {/* Payment Methods */}
      <div className="border-t border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} Juancogroup Electronics. All rights reserved.</p>
          <div className="flex gap-2">
            <span className="bg-mpesa text-white text-xs px-3 py-1 rounded-full font-medium">📱 M-Pesa</span>
            <span className="bg-gray-700 text-white text-xs px-3 py-1 rounded-full font-medium">💵 Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}