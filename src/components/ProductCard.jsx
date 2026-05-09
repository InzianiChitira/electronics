import { Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';

export default function ProductCard({ product }) {
  const addItem = useCartStore(s => s.addItem);
  const image = product.images?.[0]?.src || 'https://placehold.co/400x300?text=No+Image';

  const price = parseFloat(product.price);
  const regularPrice = parseFloat(product.regular_price);
  const onSale = product.on_sale && regularPrice > price;

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden group">
      
      {/* Image */}
      <Link to={`/product/${product.id}`}>
        <div className="overflow-hidden h-48">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        </div>
      </Link>

      {/* Sale Badge */}
      {onSale && (
        <span className="absolute mt-[-180px] ml-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          Sale
        </span>
      )}

      <div className="p-4">
        {/* Name */}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-800 hover:text-primary transition line-clamp-2 text-sm">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-primary font-bold">
            KES {price.toLocaleString()}
          </span>
          {onSale && (
            <span className="text-gray-400 text-sm line-through">
              KES {regularPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <p className={`text-xs mt-1 ${product.stock_status === 'instock' ? 'text-green-500' : 'text-red-400'}`}>
          {product.stock_status === 'instock' ? '✓ In Stock' : '✗ Out of Stock'}
        </p>

        {/* Add to Cart */}
        <button
          onClick={() => addItem(product)}
          disabled={product.stock_status !== 'instock'}
          className="mt-3 w-full bg-primary text-white py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}