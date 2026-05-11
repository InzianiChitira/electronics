import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getCategories } from '../api/woocommerce';
import ProductCard from '../components/ProductCard';

const slides = [
  {
    title: 'Next-Gen',
    subtitle: 'Smartphones',
    desc: 'Discover the latest flagship phones with cutting-edge technology at unbeatable prices.',
    bg: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1600&q=80',
    cta: 'Shop Phones',
    accent: '#2563eb',
  },
  {
    title: 'Premium',
    subtitle: 'Laptops & PCs',
    desc: 'Power through your day with high-performance laptops built for creators and professionals.',
    bg: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1600&q=80',
    cta: 'Shop Laptops',
    accent: '#0f172a',
  },
  {
    title: 'Smart',
    subtitle: 'Accessories',
    desc: 'Complete your setup with premium accessories — earbuds, watches, chargers and more.',
    bg: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1600&q=80',
    cta: 'Shop Accessories',
    accent: '#00a651',
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
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setSlide(s => (s + 1) % slides.length);
        setAnimating(false);
      }, 500);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (i) => {
    setAnimating(true);
    setTimeout(() => {
      setSlide(i);
      setAnimating(false);
    }, 300);
  };

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

  const current = slides[slide];

  return (
    <div>

      {/* Hero Slider */}
      <section className="relative h-[45vh] min-h-[380px] max-h-[450px] overflow-hidden">

        {/* Background Image */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${animating ? 'opacity-0' : 'opacity-100'}`}
          style={{
            backgroundImage: `url(${current.bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center py-6">
          <div className={`transition-all duration-500 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>

            {/* Tag */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-px bg-white opacity-60" />
              <span className="text-white text-xs font-medium tracking-[0.2em] uppercase opacity-80">
                Juancogroup Electronics
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-black text-white leading-none mb-1 tracking-tight">
              {current.title}
            </h1>
            <h2
              className="text-3xl md:text-4xl font-black leading-none mb-4 tracking-tight"
              style={{ color: current.accent === '#0f172a' ? '#60a5fa' : current.accent }}
            >
              {current.subtitle}
            </h2>

            {/* Description */}
            <p className="text-white/70 text-sm max-w-md mb-6 leading-relaxed">
              {current.desc}
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Link
                to="/shop"
                className="bg-white text-dark font-bold px-6 py-3 rounded-full hover:bg-gray-100 transition text-xs tracking-wide uppercase"
              >
                {current.cta}
              </Link>
              <Link
                to="/shop"
                className="border border-white/40 text-white font-medium px-6 py-3 rounded-full hover:bg-white/10 transition text-xs tracking-wide uppercase backdrop-blur-sm"
              >
                View All
              </Link>
            </div>

          </div>
        </div>

        {/* Slide dots — bottom center */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`transition-all duration-300 rounded-full ${
                i === slide
                  ? 'w-8 h-2 bg-white'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* M-Pesa badge */}
        <div className="absolute bottom-5 right-6 z-10">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 py-2 flex items-center gap-2">
            <span className="text-base">📱</span>
            <div>
              <p className="text-white text-xs font-bold">Pay with M-Pesa</p>
              <p className="text-white/60 text-xs">Fast and Secure</p>
            </div>
          </div>
        </div>

      </section>

      {/* Features Strip */}
      <section className="bg-dark text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/10">
          {features.map(({ icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3 px-6 py-3">
              <span className="text-xl">{icon}</span>
              <div>
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-white/50 text-xs">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">
              Hand Picked
            </p>
            <h2 className="text-3xl font-black text-dark">Featured Products</h2>
          </div>
          <Link to="/shop" className="text-sm font-semibold text-primary hover:underline">
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
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">
                  Browse By
                </p>
                <h2 className="text-3xl font-black text-dark">Categories</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.filter(c => c.count > 0).map((cat, i) => (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.id}`}
                  className="group relative bg-white rounded-2xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div
                    className="absolute inset-0 opacity-5 group-hover:opacity-10 transition"
                    style={{ background: `hsl(${i * 60}, 70%, 50%)` }}
                  />
                  <div className="relative p-6 flex flex-col items-center gap-3 text-center">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition"
                      style={{ background: `hsl(${i * 60}, 70%, 95%)` }}
                    >
                      📦
                    </div>
                    <p className="font-bold text-dark group-hover:text-primary transition">
                      {cat.name}
                    </p>
                    <p className="text-gray-400 text-xs">{cat.count} products</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">
              Just Arrived
            </p>
            <h2 className="text-3xl font-black text-dark">Latest Products</h2>
          </div>
          <Link to="/shop" className="text-sm font-semibold text-primary hover:underline">
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
      <section className="relative overflow-hidden bg-dark py-20">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/90 to-dark/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
              New Arrivals
            </p>
            <h2 className="text-4xl font-black text-white mb-2">Check Out the Latest</h2>
            <p className="text-white/50">Fresh tech drops every week. Be the first to grab them.</p>
          </div>
          <Link
            to="/shop"
            className="flex-shrink-0 bg-white text-dark font-bold px-10 py-4 rounded-full hover:bg-gray-100 transition uppercase tracking-wide text-sm"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Contact Strip */}
      <section className="bg-white border-t py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">
              We Are Here
            </p>
            <h2 className="text-3xl font-black text-dark">Get in Touch</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contacts.map(({ icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 hover:shadow-md transition group border border-transparent hover:border-primary/20"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl group-hover:bg-primary group-hover:scale-110 transition">
                  {icon}
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide">{label}</p>
                  <p className="font-bold text-dark group-hover:text-primary transition">{value}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}