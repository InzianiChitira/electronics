import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../api/woocommerce';

export default function LiveSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [total, setTotal] = useState(0);
  const timerRef = useRef(null);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

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

  return (
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

      {show && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border z-[500] overflow-hidden">
          {loading ? (
            <div className="p-4 text-center text-gray-400 text-sm">Searching...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-gray-400 text-sm">No products found</div>
          ) : (
            <>
              {results.map(product => (
                <button
                  key={product.id}
                  onClick={() => handleItemClick(product.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition border-b last:border-0 text-left"
                >
                  <img
                    src={product.images?.[0]?.src || 'https://placehold.co/44x44?text=No+Image'}
                    alt={product.name}
                    className="w-11 h-11 object-cover rounded-lg flex-shrink-0 border"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-dark truncate">{product.name}</p>
                    <p className="text-xs text-primary font-bold mt-0.5">
                      KES {parseFloat(product.price).toLocaleString()}
                    </p>
                    {product.categories?.[0] && (
                      <p className="text-xs text-gray-400 uppercase mt-0.5">
                        {product.categories[0].name}
                      </p>
                    )}
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}

              {total > results.length && (
                <button
                  onClick={handleViewAll}
                  className="w-full py-3 bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-700 transition"
                >
                  View all {total} results
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}