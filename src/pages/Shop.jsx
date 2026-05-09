import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getCategories } from '../api/woocommerce';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Electronics Shop</h1>
        <p className="text-gray-500 mt-1">
          {products?.length || 0} products available
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl shadow p-4 mb-8 flex flex-col md:flex-row gap-4">

        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded-xl px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Categories</option>
          {categories?.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name} ({cat.count})
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="date">Newest First</option>
          <option value="price">Price: Low to High</option>
          <option value="popularity">Most Popular</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow h-72 animate-pulse">
              <div className="bg-gray-200 h-48 rounded-t-2xl" />
              <div className="p-4 space-y-2">
                <div className="bg-gray-200 h-4 rounded w-3/4" />
                <div className="bg-gray-200 h-4 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-500 text-lg">Failed to load products.</p>
          <p className="text-gray-400 text-sm mt-2">Check your API keys in the .env file</p>
        </div>
      ) : filtered?.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No products found for "{search}"</p>
          <button
            onClick={() => setSearch('')}
            className="mt-4 text-primary hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filtered?.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}