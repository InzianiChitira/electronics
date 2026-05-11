import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../api/woocommerce';
import useCartStore from '../store/cartStore';
import useCartSidebarStore from '../store/cartSidebarStore';
import QuickViewModal from './QuickViewModal';

export default function LiveSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [total, setTotal] = useState(0);
  const [addedId, setAddedId] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const timerRef = useRef(null);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const addItem = useCartStore(s => s.addItem);
  const openCart = useCartSidebarStore(s => s.open);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShow(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleInput = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(timerRef.current);

    if (val.trim().length < 2) {
      setShow(false);
      setResults([]);
      return;
    }

    setLoading(true);
    setShow(true);

    timerRef.current = setTimeout(async () => {
      try {
        const res = await getProducts({ search: val, per_page: 6 });
        setResults(res.data);
        setTotal(parseInt(res.headers['x-wp-total'] || res.data.length));
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleViewAll = () => {
    setShow(false);
    setQuery('');
    navigate(`/shop?search=${query}`);
  };

  const handleItemClick = (id) => {
    setShow(false);
    setQuery('');
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addItem(product);
    setAddedId(product.id);
    openCart();
    setTimeout(() => setAddedId(null), 2000);
  };

  const handleBuyNow = (e, product) => {
    e.stopPropagation();
    addItem(product);
    setShow(false);
    setQuery('');
    navigate('/checkout');
  };

  const handleQuickView = (e, product) => {
    e.stopPropagation();
    setShow(false);
    setQuickViewProduct(product);
  };

  const handleWhatsApp = (e, product) => {
    e.stopPropagation();
    const price = parseFloat(product.price).toLocaleString();
    const msg = `Hi, I am interested in: ${product.name} - KES ${price}`;
    window.open(`https://wa.me/254700000000?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <>
      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      <div ref={wrapperRef} className="relative flex-1">
        <div className="flex border-2 border-primary rounded-xl overflow-hidden">
          <input
            type="text"
            value={query}
            onChange={handleInput}
            onFocus={() => query.length >= 2 && setShow(true)}
            placeholder="Search for products..."
            className="flex-1 px-4 py-2 text-sm focus:outline-none"
          />
          <button
            onClick={handleViewAll}
            className="bg-primary text-white px-5 flex items-center justify-center hover:bg-blue-700 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </button>
        </div>

        {/* Dropdown */}
        {show && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border z-[500] overflow-hidden">
            {loading ? (
              <div className="p-6 text-center">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Searching...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-400 text-sm">No products found for "{query}"</p>
              </div>
            ) : (
              <>
                {/* Results Header */}
                <div className="px-4 py-2 bg-gray-50 border-b flex items-center justify-between">
                  <p className="text-xs text-gray-500 font-medium">
                    {total} result{total !== 1 ? 's' : ''} found
                  </p>
                  <button
                    onClick={() => { setShow(false); setQuery(''); }}
                    className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                  >
                    x
                  </button>
                </div>

                {/* Product Results */}
                {results.map(product => {
                  const price = parseFloat(product.price);
                  const regularPrice = parseFloat(product.regular_price);
                  const onSale = product.on_sale && regularPrice > price;
                  const inStock = product.stock_status === 'instock';
                  const isAdded = addedId === product.id;

                  return (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition border-b last:border-0 group"
                    >
                      {/* Image */}
                      <button
                        onClick={() => handleItemClick(product.id)}
                        className="flex-shrink-0"
                      >
                        <img
                          src={product.images?.[0]?.src || 'https://placehold.co/56x56?text=No+Image'}
                          alt={product.name}
                          className="w-14 h-14 object-cover rounded-xl border hover:opacity-80 transition"
                        />
                      </button>

                      {/* Details */}
                      <button
                        onClick={() => handleItemClick(product.id)}
                        className="flex-1 min-w-0 text-left"
                      >
                        <p className="text-sm font-semibold text-dark truncate hover:text-primary transition">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-sm font-bold text-primary">
                            KES {price.toLocaleString()}
                          </p>
                          {onSale && (
                            <p className="text-xs text-gray-400 line-through">
                              KES {regularPrice.toLocaleString()}
                            </p>
                          )}
                        </div>
                        {product.categories?.[0] && (
                          <p className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">
                            {product.categories[0].name}
                          </p>
                        )}
                      </button>

                      {/* Action Icons */}
                      <div className="flex items-center gap-1 flex-shrink-0">

                        {/* Quick View — opens modal */}
                        <div className="relative group/tip">
                          <button
                            onClick={(e) => handleQuickView(e, product)}
                            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition text-gray-400"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition pointer-events-none z-10">
                            Quick View
                          </span>
                        </div>

                        {/* Add to Cart */}
                        <div className="relative group/tip">
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={!inStock}
                            className={`w-8 h-8 rounded-full border flex items-center justify-center transition ${
                              isAdded
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-gray-200 text-gray-400 hover:bg-orange-500 hover:text-white hover:border-orange-500'
                            } disabled:opacity-40 disabled:cursor-not-allowed`}
                          >
                            {isAdded ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            )}
                          </button>
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition pointer-events-none z-10">
                            {isAdded ? 'Added!' : 'Add to Cart'}
                          </span>
                        </div>

                        {/* Buy Now */}
                        <div className="relative group/tip">
                          <button
                            onClick={(e) => handleBuyNow(e, product)}
                            disabled={!inStock}
                            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-dark hover:text-white hover:border-dark transition text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </button>
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition pointer-events-none z-10">
                            Buy Now
                          </span>
                        </div>

                        {/* WhatsApp */}
                        <div className="relative group/tip">
                          <button
                            onClick={(e) => handleWhatsApp(e, product)}
                            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-mpesa hover:text-white hover:border-mpesa transition text-gray-400"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                          </button>
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition pointer-events-none z-10">
                            WhatsApp
                          </span>
                        </div>

                      </div>
                    </div>
                  );
                })}

                {/* View All Footer */}
                {total > results.length && (
                  <button
                    onClick={handleViewAll}
                    className="w-full py-3 bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-700 transition"
                  >
                    View all {total} results for "{query}"
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}