import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getCategories } from '../api/woocommerce';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('date');

  // Sync URL params
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories().then(r => r.data),
  });

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', selectedCategory, sortBy],
    queryFn: () =>
      getProducts({
        per_page: 50,
        category: selectedCategory || undefined,
        orderby: sortBy,
        order: sortBy === 'price' ? 'asc' : 'desc',
      }).then(r => r.data),
  });

  const filtered = products?.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCategoryName = categories?.find(c => c.id === parseInt(selectedCategory))?.name;

  const ProductSkeleton = () => (
    <div className="bg-white rounded-2xl shadow h-80 animate-pulse">
      <div className="bg-gray-200 h-52 rounded-t-2xl" />
      <div className="p-4 space-y-2">
        <div className="bg-gray-200 h-4 rounded w-3/4" />
        <div className="bg-gray-200 h-4 rounded w-1/2" />
        <div className="bg-gray-200 h-8 rounded w-full" />
      </div>
    </div>
  );

  return (
    <div className="font-poppins">

      {/* Page Header */}
      <div className="bg-dark text-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">
            {selectedCategoryName || 'Electronics Shop'}
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            {filtered?.length || 0} products available
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-8">

        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">

          {/* Search */}
          <div className="bg-white rounded-2xl shadow p-5 mb-5">
            <h3 className="font-bold text-dark mb-3">Search</h3>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Categories */}
          <div className="bg-white rounded-2xl shadow p-5 mb-5">
            <h3 className="font-bold text-dark mb-3">Categories</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left text-sm px-3 py-2 rounded-xl transition ${
                    selectedCategory === ''
                      ? 'bg-primary text-white font-semibold'
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  All Products
                </button>
              </li>
              {categories?.filter(c => c.count > 0).map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => setSelectedCategory(String(cat.id))}
                    className={`w-full text-left text-sm px-3 py-2 rounded-xl transition flex justify-between items-center ${
                      selectedCategory === String(cat.id)
                        ? 'bg-primary text-white font-semibold'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedCategory === String(cat.id)
                        ? 'bg-white bg-opacity-30 text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Sort */}
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="font-bold text-dark mb-3">Sort By</h3>
            <ul className="space-y-2">
              {[
                { value: 'date', label: 'Newest First' },
                { value: 'price', label: 'Price: Low to High' },
                { value: 'popularity', label: 'Most Popular' },
                { value: 'rating', label: 'Top Rated' },
              ].map(opt => (
                <li key={opt.value}>
                  <button
                    onClick={() => setSortBy(opt.value)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-xl transition ${
                      sortBy === opt.value
                        ? 'bg-primary text-white font-semibold'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </aside>

        {/* Products Grid */}
        <div className="flex-1">

          {/* Active Filters */}
          {(selectedCategory || search) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategoryName && (
                <span className="bg-primary text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  {selectedCategoryName}
                  <button onClick={() => setSelectedCategory('')} className="ml-1 font-bold">×</button>
                </span>
              )}
              {search && (
                <span className="bg-dark text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  "{search}"
                  <button onClick={() => setSearch('')} className="ml-1 font-bold">×</button>
                </span>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 text-lg font-semibold">Failed to load products.</p>
              <p className="text-gray-400 text-sm mt-2">Check your API connection.</p>
            </div>
          ) : filtered?.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg font-semibold">No products found</p>
              <button
                onClick={() => { setSearch(''); setSelectedCategory(''); }}
                className="mt-4 text-primary hover:underline font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {filtered?.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}