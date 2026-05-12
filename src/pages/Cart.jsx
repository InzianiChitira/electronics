import { Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal, getCount } = useCartStore();

  if (items.length === 0) return (
    <div className="max-w-6xl mx-auto px-4 py-20 text-center">
      <div className="text-8xl mb-6">🛒</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-8">Looks like you have not added anything yet.</p>
      <Link
        to="/shop"
        className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition"
      >
        Start Shopping
      </Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Your Cart ({getCount()} {getCount() === 1 ? 'item' : 'items'})
      </h1>

      <div className="grid md:grid-cols-3 gap-8">

        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.cartKey} className="bg-white rounded-2xl shadow p-4 flex gap-4 items-start">

              {/* Image */}
              <img
                src={item.images?.[0]?.src || 'https://placehold.co/100x100?text=No+Image'}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
              />

              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${item.id}`}
                  className="font-semibold text-gray-800 hover:text-primary line-clamp-2"
                >
                  {item.name}
                </Link>

                {/* Variation attributes */}
                {item.selected_attributes && Object.keys(item.selected_attributes).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {Object.entries(item.selected_attributes).map(([key, value]) => (
                      <span
                        key={key}
                        className="text-xs bg-blue-50 text-primary border border-primary/20 px-2 py-0.5 rounded-full capitalize font-medium"
                      >
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-primary font-bold mt-2">
                  KES {parseFloat(item.price).toLocaleString()}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-gray-100 transition font-bold"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100 transition font-bold"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.cartKey)}
                    className="text-red-400 hover:text-red-600 transition text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Item Total */}
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-gray-800">
                  KES {(parseFloat(item.price) * item.quantity).toLocaleString()}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({getCount()} items)</span>
                <span>KES {getTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="text-green-600 font-medium">Calculated at checkout</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">KES {getTotal().toLocaleString()}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="mt-6 block text-center bg-primary text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/shop"
              className="mt-3 block text-center text-primary hover:underline text-sm"
            >
              Continue Shopping
            </Link>

            {/* Payment Methods */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-gray-500 text-center mb-3">We Accept</p>
              <div className="flex justify-center gap-3">
                <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                  📱 M-Pesa
                </span>
                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                  💵 Cash on Delivery
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}