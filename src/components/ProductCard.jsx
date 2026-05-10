import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useCartSidebarStore from '../store/cartSidebarStore';

function QuickViewModal({ product, onClose }) {
  const addItem = useCartStore(s => s.addItem);
  const openCart = useCartSidebarStore(s => s.open);
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const price = parseFloat(product.price);
  const regularPrice = parseFloat(product.regular_price);
  const onSale = product.on_sale && regularPrice > price;
  const inStock = product.stock_status === 'instock';

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    onClose();
    navigate('/checkout');
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold text-dark text-lg">Quick View</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-500 hover:text-white transition flex items-center justify-center font-bold text-lg"
          >
            x
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div>
            <div className="bg-gray-50 rounded-xl overflow-hidden mb-3">
              <img
                src={product.images?.[activeImage]?.src || 'https://placehold.co/400x400?text=No+Image'}
                alt={product.name}
                className="w-full h-64 object-contain p-4"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                      activeImage === i ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img.src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-dark">{product.name}</h3>

            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-primary">
                KES {price.toLocaleString()}
              </span>
              {onSale && (
                <span className="text-gray-400 line-through">
                  KES {regularPrice.toLocaleString()}
                </span>
              )}
            </div>

            <span className={`text-sm font-medium w-fit px-3 py-1 rounded-full ${
              inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {inStock ? '✓ In Stock' : '✗ Out of Stock'}
            </span>

            {product.short_description && (
              <div
                className="text-gray-500 text-sm leading-relaxed line-clamp-3"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            )}

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Qty:</span>
              <div className="flex items-center border rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-2 hover:bg-gray-100 font-bold transition"
                >-</button>
                <span className="px-4 py-2 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-3 py-2 hover:bg-gray-100 font-bold transition"
                >+</button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`w-full py-3 rounded-xl font-bold transition ${
                  added ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-blue-700'
                } disabled:opacity-50`}
              >
                {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!inStock}
                className="w-full py-3 rounded-xl font-bold bg-dark text-white hover:bg-gray-800 transition disabled:opacity-50"
              >
                ⚡ Buy Now
              </button>
              <a
                href={`https://wa.me/254700000000?text=Hi, I am interested in: ${encodeURIComponent(product.name)} - KES ${price.toLocaleString()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl font-bold bg-mpesa text-white hover:bg-green-700 transition text-center"
              >
                💬 WhatsApp Order
              </a>
            </div>

            <Link
              to={`/product/${product.id}`}
              onClick={onClose}
              className="text-primary text-sm hover:underline text-center"
            >
              View Full Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductCard({ product }) {
  const addItem = useCartStore(s => s.addItem);
  const openCart = useCartSidebarStore(s => s.open);
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const image = product.images?.[0]?.src || 'https://placehold.co/400x300?text=No+Image';
  const price = parseFloat(product.price);
  const regularPrice = parseFloat(product.regular_price);
  const onSale = product.on_sale && regularPrice > price;
  const discount = onSale ? Math.round(((regularPrice - price) / regularPrice) * 100) : 0;
  const inStock = product.stock_status === 'instock';
  const whatsappUrl = `https://wa.me/254700000000?text=Hi, I am interested in: ${encodeURIComponent(product.name)} - KES ${price.toLocaleString()}`;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    addItem(product);
    navigate('/checkout');
  };

  return (
    <>
      {showModal && (
        <QuickViewModal product={product} onClose={() => setShowModal(false)} />
      )}

      <div className="bg-white rounded-2xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden group relative flex flex-col">

        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {onSale && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discount}%
            </span>
          )}
          {product.featured && (
            <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>

        {/* Image */}
        <Link to={`/product/${product.id}`}>
          <div className="relative h-52 overflow-hidden bg-gray-50">
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-contain p-3 group-hover:scale-105 transition duration-500"
            />
          </div>
        </Link>

        {/* Details */}
        <div className="p-4 flex flex-col flex-1">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-semibold text-gray-800 hover:text-primary transition line-clamp-2 text-sm leading-snug mb-2">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-primary font-bold text-lg">
              KES {price.toLocaleString()}
            </span>
            {onSale && (
              <span className="text-gray-400 text-sm line-through">
                KES {regularPrice.toLocaleString()}
              </span>
            )}
          </div>

          <p className={`text-xs font-medium mb-3 ${inStock ? 'text-green-500' : 'text-red-400'}`}>
            {inStock ? '✓ In Stock' : '✗ Out of Stock'}
          </p>

          {/* Icon Action Bar */}
          <div className="mt-auto pt-3 border-t flex items-center justify-around">

            {/* Quick View */}
            <div className="relative group/tip">
              <button
                onClick={() => setShowModal(true)}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition pointer-events-none">
                Quick View
              </span>
            </div>

            {/* Add to Cart */}
            <div className="relative group/tip">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition ${
                  added
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-200 text-gray-500 hover:bg-orange-500 hover:text-white hover:border-orange-500'
                } disabled:opacity-40`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition pointer-events-none">
                {added ? 'Added!' : 'Add to Cart'}
              </span>
            </div>

            {/* Buy Now */}
            <div className="relative group/tip">
              <button
                onClick={handleBuyNow}
                disabled={!inStock}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-dark hover:text-white hover:border-dark transition text-gray-500 disabled:opacity-40"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition pointer-events-none">
                Buy Now
              </span>
            </div>

            {/* WhatsApp */}
            <div className="relative group/tip">
                <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-mpesa hover:text-white hover:border-mpesa transition text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition pointer-events-none">
                WhatsApp Order
              </span>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}