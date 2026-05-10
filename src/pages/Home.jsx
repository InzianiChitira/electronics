import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getCategories } from '../api/woocommerce';
import ProductCard from '../components/ProductCard';

const slides = [
  {
    title: 'Premium Tech Products',
    subtitle: 'Discover the latest smartphones, laptops & accessories',
    bg: 'from-slate-900 to-blue-900',
    emoji: '📱',
  },
  {
    title: 'New Arrivals Just In',
    subtitle: 'Check out the hottest electronics at the best prices in Kenya',
    bg: 'from-blue-900 to-indigo-900',
    emoji: '💻',
  },
  {
    title: 'Pay with M-Pesa',
    subtitle: 'Fast, secure checkout with Lipa na M-Pesa STK push',
    bg: 'from-green-900 to-teal-900',
    emoji: '🛒',
  },
];

const features = [
  { icon: '🚚', title: 'Fast Delivery', desc: 'Shipping across Kenya' },
  { icon: '🔒', title: 'Secure Payment', desc: 'Safe payment methods' },
  { icon: '💬', title: 'Support 24/7', desc: 'Contact us anytime' },
  { icon: '✅', title: 'Warranty', desc: 'On all products' },
];

const contacts = [
  { icon: '📞', label: 'Phone', value: '+254 700 000 000', href: 'tel:+254700000000' },
  { icon: '✉️', label: 'Email', value: 'info@juancogroup.co.ke', href: 'mailto:info@juancogroup.co.ke' },
  { icon: '📍', label: 'Location', value: 'Nairobi, Kenya', href: '#' },
];

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

export default function Home() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide(s => (s + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const { data: featured, isLoading: loadingFeatured } = useQuery({
    queryKey: ['featured'],
    queryFn: () => getProducts({ per_page: 8, featured: true }).then(r => r.data),
  });

  const { data: latest, isLoading: loadingLatest } = useQuery({
    queryKey: ['latest'],
    queryFn: () => getProducts({ per_page: 8, orderby: 'date', order: 'desc' }).then(r => r.data),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories().then(r => r.data),
  });

  return (
    <div className="font-poppins">

      {/* Hero Slider */}
      <section className={`bg-gradient-to-r ${slides[slide].bg} text-white transition-all duration-700`}>
        <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col gap-6 max-w-xl">
            <span className="bg-white bg-opacity-20 text-white text-sm font-medium px-4 py-1 rounded-full w-fit">
              New Arrivals
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {slides[slide].title}
            </h1>
            <p className="text-blue-100 text-lg">
              {slides[slide].subtitle}
            </p>
            <div className="flex gap-4">
              <Link
                to="/shop"
                className="bg-white text-dark font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition shadow-lg"
              >
                Shop Now
              </Link>
              <Link
                to="/shop"
                className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white hover:text-dark transition"
              >
                Browse All
              </Link>
            </div>
          </div>
          <div className="text-[120px] md:text-[160px] select-none animate-bounce">
            {slides[slide].emoji}
          </div>
        </div>
        <div className="flex justify-center gap-2 pb-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`w-3 h-3 rounded-full transition ${i === slide ? 'bg-white' : 'bg-white bg-opacity-40'}`}
            />
          ))}
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map(({ icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3 p-3">
              <span className="text-3xl">{icon}</span>
              <div>
                <p className="font-semibold text-dark text-sm">{title}</p>
                <p className="text-gray-400 text-xs">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-dark">Featured Products</h2>
            <p className="text-gray-400 text-sm mt-1">Hand-picked products for you</p>
          </div>
          <Link to="/shop" className="text-primary hover:underline font-semibold text-sm">
            View all →
          </Link>
        </div>
        {loadingFeatured ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : featured?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {latest?.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Browse Categories */}
      {categories?.filter(c => c.count > 0).length > 0 && (
        <section className="bg-gray-50 py-14">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-dark">Browse Categories</h2>
                <p className="text-gray-400 text-sm mt-1">Find what you are looking for</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.filter(c => c.count > 0).map(cat => (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.id}`}
                  className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6 flex flex-col items-center gap-3 group"
                >
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl group-hover:bg-primary group-hover:text-white transition">
                    📦
                  </div>
                  <p className="font-semibold text-dark group-hover:text-primary transition text-center">
                    {cat.name}
                  </p>
                  <p className="text-gray-400 text-xs">{cat.count} items</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Products */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-dark">Latest Products</h2>
            <p className="text-gray-400 text-sm mt-1">Fresh arrivals in our store</p>
          </div>
          <Link to="/shop" className="text-primary hover:underline font-semibold text-sm">
            View all →
          </Link>
        </div>
        {loadingLatest ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {latest?.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-dark to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">New Arrivals</h2>
            <p className="text-gray-300">Check out the latest tech products</p>
          </div>
          <Link
            to="/shop"
            className="bg-primary text-white font-bold px-10 py-4 rounded-full hover:bg-blue-700 transition shadow-lg flex-shrink-0"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Contact Strip */}
      <section className="bg-white border-t py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-dark text-center mb-10">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contacts.map(({ icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 hover:shadow transition group"
              >
                <span className="text-3xl">{icon}</span>
                <div>
                  <p className="text-gray-400 text-xs">{label}</p>
                  <p className="font-semibold text-dark group-hover:text-primary transition">{value}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}