import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import { createOrder } from '../api/woocommerce';

export default function Checkout() {
  const { items, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  if (items.length === 0) return (
    <div className="max-w-6xl mx-auto px-4 py-20 text-center">
      <p className="text-xl text-gray-600 mb-4">Your cart is empty.</p>
      <Link to="/shop" className="bg-primary text-white px-6 py-3 rounded-full font-bold">
        Go Shopping
      </Link>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        payment_method: paymentMethod === 'mpesa' ? 'juancogroup_mpesa' : 'cod',
        payment_method_title: paymentMethod === 'mpesa' ? 'Lipa na M-Pesa' : 'Cash on Delivery',
        set_paid: false,
        billing: {
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone,
          address_1: form.address,
          city: form.city,
          country: 'KE',
        },
        shipping: {
          first_name: form.first_name,
          last_name: form.last_name,
          address_1: form.address,
          city: form.city,
          country: 'KE',
        },
        line_items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        meta_data: [
          {
            key: '_mpesa_phone',
            value: form.phone,
          },
        ],
      };

      const response = await createOrder(orderData);
      const order = response.data;
      clearCart();

      if (paymentMethod === 'mpesa') {
        // Redirect to WooCommerce to trigger STK push
        window.location.href = `https://juancogroup.co.ke/checkout/order-pay/${order.id}/?pay_for_order=true&key=${order.order_key}`;
      } else {
        navigate(`/order-success?id=${order.id}&method=cod`);
      }
    } catch (err) {
      alert('Failed to place order. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-3 gap-8">

          {/* Left Column */}
          <div className="md:col-span-2 space-y-6">

            {/* Personal Details */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-bold mb-4">📋 Your Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">First Name *</label>
                  <input
                    name="first_name"
                    required
                    value={form.first_name}
                    onChange={handleChange}
                    className="border rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Last Name *</label>
                  <input
                    name="last_name"
                    required
                    value={form.last_name}
                    onChange={handleChange}
                    className="border rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm text-gray-600 mb-1 block">Email Address *</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="border rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="mt-4">
                <label className="text-sm text-gray-600 mb-1 block">Phone Number *</label>
                <input
                  name="phone"
                  required
                  placeholder="e.g. 0712345678"
                  value={form.phone}
                  onChange={handleChange}
                  className="border rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="mt-4">
                <label className="text-sm text-gray-600 mb-1 block">Delivery Address *</label>
                <input
                  name="address"
                  required
                  placeholder="Street address"
                  value={form.address}
                  onChange={handleChange}
                  className="border rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="mt-4">
                <label className="text-sm text-gray-600 mb-1 block">City / Town *</label>
                <input
                  name="city"
                  required
                  placeholder="e.g. Nairobi"
                  value={form.city}
                  onChange={handleChange}
                  className="border rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-bold mb-4">💳 Payment Method</h2>
              <div className="space-y-3">

                {/* M-Pesa */}
                <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition ${
                  paymentMethod === 'mpesa'
                    ? 'border-mpesa bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="mpesa"
                    checked={paymentMethod === 'mpesa'}
                    onChange={() => setPaymentMethod('mpesa')}
                    className="accent-mpesa"
                  />
                  <span className="text-3xl">📱</span>
                  <div>
                    <p className="font-bold text-mpesa">Lipa na M-Pesa</p>
                    <p className="text-sm text-gray-500">
                      You'll receive an STK push on your phone. Enter your PIN to pay.
                    </p>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition ${
                  paymentMethod === 'cod'
                    ? 'border-primary bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-primary"
                  />
                  <span className="text-3xl">💵</span>
                  <div>
                    <p className="font-bold text-gray-800">Cash on Delivery</p>
                    <p className="text-sm text-gray-500">
                      Pay with cash when your order is delivered to you.
                    </p>
                  </div>
                </label>

              </div>
            </div>
          </div>

          {/* Right Column — Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-4">🧾 Order Summary</h2>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <img
                      src={item.images?.[0]?.src || 'https://placehold.co/60x60?text=No+Image'}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-800 flex-shrink-0">
                      KES {(parseFloat(item.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>KES {getTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery</span>
                  <span>TBD</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">KES {getTotal().toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full py-4 rounded-xl text-white font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed bg-primary hover:bg-blue-700"
              >
                {loading
                  ? '⏳ Placing Order...'
                  : paymentMethod === 'mpesa'
                  ? '📱 Pay with M-Pesa'
                  : '✅ Place Order'}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                By placing your order you agree to our terms and conditions.
              </p>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}