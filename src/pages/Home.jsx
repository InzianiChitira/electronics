import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/woocommerce';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => getProducts({ per_page: 8, featured: true }).then(r => r.data),
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center text-center gap-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Kenya's Best Electronics Store
          </h1>
          <p className="text-blue-100 text-lg max-w-xl">
            Shop the latest phones, laptops, TVs and more. Fast delivery across Kenya. Pay with M-Pesa.
          </p>
          <div className="flex gap-4">
            <Link
              to="/shop"
              className="bg-white text-primary font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition"
            >
              Shop Now
            </Link>
            <Link
              to="/shop"
              className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white hover:text-primary transition"
            >
              View Deals
            </Link>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { icon: '🚚', text: 'Fast Delivery' },
            { icon: '📱', text: 'Pay with M-Pesa' },
            { icon: '✅', text: 'Genuine Products' },
            { icon: '🔄', text: 'Easy Returns' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center justify-center gap-2 text-gray-600 font-medium">
              <span className="text-2xl">{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
          <Link to="/shop" className="text-primary hover:underline font-medium">
            View All →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow h-72 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-t-2xl" />
                <div className="p-4 space-y-2">
                  <div className="bg-gray-200 h-4 rounded w-3/4" />
                  <div className="bg-gray-200 h-4 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">No featured products yet.</p>
            <Link to="/shop" className="bg-primary text-white px-6 py-2 rounded-full">
              Browse All Products
            </Link>
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="bg-mpesa text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-3">Pay Easily with M-Pesa</h2>
          <p className="text-green-100 mb-6">
            Checkout in seconds. Get an STK push directly to your phone.
          </p>
          <Link
            to="/shop"
            className="bg-white text-mpesa font-bold px-8 py-3 rounded-full hover:bg-green-50 transition"
          >
            Start Shopping
          </Link>
        </div>
      </section>
    </div>
  );
}