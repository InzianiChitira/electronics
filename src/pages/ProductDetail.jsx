import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProduct } from '../api/woocommerce';
import useCartStore from '../store/cartStore';

export default function ProductDetail() {
  const { id } = useParams();
  const addItem = useCartStore(s => s.addItem);
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
    setTimeout(() => setAdded(false), 2000);
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-primary">Shop</Link>
        <span>/</span>
        <span className="text-gray-800">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-10">

        {/* Images */}
        <div>
          <div className="bg-white rounded-2xl shadow overflow-hidden mb-4">
            <img
              src={product.images?.[activeImage]?.src || 'https://placehold.co/600x400?text=No+Image'}
              alt={product.name}
              className="w-full h-96 object-contain p-4"
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>

          {/* Price */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-primary">
              KES {price.toLocaleString()}
            </span>
            {onSale && (
              <>
                <span className="text-gray-400 line-through text-lg">
                  KES {regularPrice.toLocaleString()}
                </span>
                <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mb-6 ${
            product.stock_status === 'instock'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {product.stock_status === 'instock' ? '✓ In Stock' : '✗ Out of Stock'}
          </div>

          {/* Description */}
          <div
            className="text-gray-600 text-sm leading-relaxed mb-6 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: product.short_description || product.description }}
          />

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center border rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-4 py-2 hover:bg-gray-100 transition font-bold"
              >
                −
              </button>
              <span className="px-4 py-2 font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="px-4 py-2 hover:bg-gray-100 transition font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock_status !== 'instock'}
              className={`w-full py-4 rounded-xl font-bold text-lg transition ${
                added
                  ? 'bg-green-500 text-white'
                  : 'bg-primary text-white hover:bg-blue-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {added ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>
            <Link
              to="/cart"
              className="w-full py-4 rounded-xl font-bold text-lg border-2 border-primary text-primary hover:bg-primary hover:text-white transition text-center"
            >
              View Cart
            </Link>
          </div>

          {/* Meta */}
          <div className="mt-6 pt-6 border-t space-y-2 text-sm text-gray-500">
            {product.sku && <p><span className="font-medium">SKU:</span> {product.sku}</p>}
            {product.categories?.length > 0 && (
              <p>
                <span className="font-medium">Category:</span>{' '}
                {product.categories.map(c => c.name).join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Full Description */}
      {product.description && (
        <div className="mt-12 bg-white rounded-2xl shadow p-8">
          <h2 className="text-xl font-bold mb-4">Product Description</h2>
          <div
            className="text-gray-600 leading-relaxed prose max-w-none"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      )}

    </div>
  );
}