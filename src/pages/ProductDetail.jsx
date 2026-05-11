import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProduct } from '../api/woocommerce';
import useCartStore from '../store/cartStore';
import useCartSidebarStore from '../store/cartSidebarStore';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore(s => s.addItem);
  const openCart = useCartSidebarStore(s => s.open);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id).then(r => r.data),
  });

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    navigate('/checkout');
  };

  if (isLoading) return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10 animate-pulse">
        <div className="bg-gray-200 rounded-2xl h-96" />
        <div className="space-y-4">
          <div className="bg-gray-200 h-8 rounded w-3/4" />
          <div className="bg-gray-200 h-6 rounded w-1/4" />
          <div className="bg-gray-200 h-4 rounded w-full" />
          <div className="bg-gray-200 h-4 rounded w-full" />
          <div className="bg-gray-200 h-4 rounded w-2/3" />
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="text-center py-20">
      <p className="text-red-500">Failed to load product.</p>
      <Link to="/shop" className="text-primary hover:underline mt-4 block">
        Back to Shop
      </Link>
    </div>
  );

  const price = parseFloat(product.price);
  const regularPrice = parseFloat(product.regular_price);
  const onSale = product.on_sale && regularPrice > price;
  const discount = onSale ? Math.round(((regularPrice - price) / regularPrice) * 100) : 0;
  const inStock = product.stock_status === 'instock';
  const whatsappUrl = `https://wa.me/254700000000?text=Hi, I am interested in: ${encodeURIComponent(product.name)} - KES ${price.toLocaleString()}`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-primary">Shop</Link>
        <span>/</span>
        <span className="text-gray-800 line-clamp-1">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-10">

        {/* Images */}
        <div>
          <div className="bg-white rounded-2xl shadow overflow-hidden mb-4">
            <img
              src={product.images?.[activeImage]?.src || 'https://placehold.co/600x400?text=No+Image'}
              alt={product.name}
              className="w-full h-96 object-contain p-6"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                    activeImage === i ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img src={img.src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>

          {/* Badges */}
          <div className="flex gap-2 mb-3">
            {onSale && (
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                -{discount}% OFF
              </span>
            )}
            {product.featured && (
              <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                Featured
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-dark mb-3">{product.name}</h1>

          {/* Price */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-primary">
              KES {price.toLocaleString()}
            </span>
            {onSale && (
              <span className="text-gray-400 line-through text-lg">
                KES {regularPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mb-5 ${
            inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {inStock ? '✓ In Stock' : '✗ Out of Stock'}
          </div>

          {/* Short Description */}
          {product.short_description && (
            <div
              className="text-gray-600 text-sm leading-relaxed mb-6 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            />
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-medium text-gray-700 text-sm">Quantity:</span>
            <div className="flex items-center border rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-4 py-2 hover:bg-gray-100 transition font-bold text-lg"
              >
                −
              </button>
              <span className="px-4 py-2 font-semibold min-w-[40px] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="px-4 py-2 hover:bg-gray-100 transition font-bold text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons with Icons */}
          <div className="flex items-center gap-3 mb-6">

            {/* Add to Cart */}
            <div className="relative group/tip flex-1">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`w-full h-12 rounded-xl border-2 flex items-center justify-center gap-2 font-semibold transition ${
                  added
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {added ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )}
                <span className="text-sm">{added ? 'Added to Cart!' : 'Add to Cart'}</span>
              </button>
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition pointer-events-none">
                Add to Cart
              </span>
            </div>

            {/* Buy Now */}
            <div className="relative group/tip flex-1">
              <button
                onClick={handleBuyNow}
                disabled={!inStock}
                className="w-full h-12 rounded-xl border-2 border-dark flex items-center justify-center gap-2 font-semibold text-dark hover:bg-dark hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm">Buy Now</span>
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
                className="w-12 h-12 rounded-xl border-2 border-mpesa flex items-center justify-center text-mpesa hover:bg-mpesa hover:text-white transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition pointer-events-none">
                WhatsApp Order
              </span>
            </div>

          </div>

          {/* M-Pesa badge */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-3 mb-6">
            <span className="text-2xl">📱</span>
            <div>
              <p className="text-green-800 font-semibold text-sm">Pay with Lipa na M-Pesa</p>
              <p className="text-green-600 text-xs">Fast and secure checkout with STK push</p>
            </div>
          </div>

          {/* Meta */}
          <div className="pt-4 border-t space-y-2 text-sm text-gray-500">
            {product.sku && (
              <p><span className="font-medium text-dark">SKU:</span> {product.sku}</p>
            )}
            {product.categories?.length > 0 && (
              <p>
                <span className="font-medium text-dark">Category:</span>{' '}
                {product.categories.map((c, i) => (
                  <Link
                    key={c.id}
                    to={`/shop?category=${c.id}`}
                    className="text-primary hover:underline"
                  >
                    {c.name}{i < product.categories.length - 1 ? ', ' : ''}
                  </Link>
                ))}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Full Description */}
      {product.description && (
        <div className="mt-12 bg-white rounded-2xl shadow p-8">
          <h2 className="text-xl font-bold mb-6 pb-3 border-b">Product Description</h2>
          <div
            className="text-gray-600 leading-relaxed prose max-w-none"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      )}

    </div>
  );
}