import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand */}
        <div>
          <h3 className="text-white text-xl font-bold mb-3">⚡ Electronics</h3>
          <p className="text-sm text-gray-400">
            Your trusted electronics store in Kenya. Quality products, fast delivery.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/shop" className="hover:text-white transition">Shop</Link></li>
            <li><Link to="/cart" className="hover:text-white transition">Cart</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-3">Contact Us</h4>
          <ul className="space-y-2 text-sm">
            <li>📍 Nairobi, Kenya</li>
            <li>📞 <a href="tel:+254700000000" className="hover:text-white transition">+254 700 000 000</a></li>
            <li>✉️ <a href="mailto:info@juancogroup.co.ke" className="hover:text-white transition">info@juancogroup.co.ke</a></li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Juancogroup Electronics. All rights reserved.
      </div>
    </footer>
  );
}