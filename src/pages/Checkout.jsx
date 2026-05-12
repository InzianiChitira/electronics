import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import { createOrder, sendStkPush, pollPaymentStatus } from '../api/woocommerce';

export default function Checkout() {
  const { items, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState('form');
  const [orderId, setOrderId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

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
    setErrorMsg('');

    if (paymentMethod === 'mpesa' && !mpesaPhone) {
      setErrorMsg('Please enter your M-Pesa phone number.');
      setLoading(false);
      return;
    }

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
        line_items: items.map(item => {
          const lineItem = {
            product_id: item.id,
            quantity: item.quantity,
          };
          // Add variation_id if this is a variable product
          if (item.variation_id) {
            lineItem.variation_id = item.variation_id;
          }
          // Add variation attributes as meta data
          if (item.selected_attributes && Object.keys(item.selected_attributes).length > 0) {
            lineItem.meta_data = Object.entries(item.selected_attributes).map(([key, value]) => ({
              key,
              value,
            }));
          }
          return lineItem;
        }),
        meta_data: [
          { key: '_mpesa_phone', value: mpesaPhone || form.phone },
        ],
      };

      const response = await createOrder(orderData);
      const order = response.data;
      setOrderId(order.id);

      if (paymentMethod === 'cod') {
        clearCart();
        navigate(`/order-success?id=${order.id}&method=cod`);
        return;
      }

      setLoading(false);
      setStage('waiting');

      const stkResponse = await sendStkPush(order.id, mpesaPhone);

      if (!stkResponse.data.success) {
        setStage('failed');
        setErrorMsg(stkResponse.data.message || 'Failed to send M-Pesa prompt.');
        return;
      }

      try {
        await pollPaymentStatus(order.id);
        clearCart();
        setStage('success');
        setTimeout(() => {
          navigate(`/order-success?id=${order.id}&method=mpesa`);
        }, 2000);
      } catch (pollErr) {
        setStage('failed');
        setErrorMsg(
          pollErr.message === 'Payment timeout'
            ? 'Payment timed out. If you completed the payment please contact us with your order number.'
            : 'Payment was not completed. Please try again.'
        );
      }

    } catch (err) {
      setErrorMsg('Failed to place order. Please try again.');
      console.error(err);
      setLoading(false);
    }
  };

  // ── Waiting Screen ──────────────────────────────────────────────
  if (stage === 'waiting') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📱</span>
          </div>
          <h2 className="text-2xl font-bold text-dark mb-2">Check Your Phone</h2>
          <p className="text-gray-500 mb-2">An M-Pesa payment prompt has been sent to</p>
          <p className="font-bold text-dark text-lg mb-6">{mpesaPhone}</p>

          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-3 h-3 bg-mpesa rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 bg-mpesa rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 bg-mpesa rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>

          <div className="bg-green-50 rounded-xl p-4 text-sm text-green-700 text-left mb-6">
            <p className="font-semibold mb-2">Steps to complete payment:</p>
            <ol className="space-y-1 list-decimal list-inside">
              <li>Check your phone for the M-Pesa prompt</li>
              <li>Enter your M-Pesa PIN</li>
              <li>Wait for confirmation</li>
            </ol>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Order Reference</span>
              <span className="text-primary font-bold">#{orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Amount</span>
              <span className="text-dark font-bold">KES {getTotal().toLocaleString()}</span>
            </div>
          </div>

          <p className="text-xs text-gray-400">
            Waiting for payment confirmation. This page will update automatically.
            Do not close or refresh this page.
          </p>
        </div>
      </div>
    );
  }

  // ── Success Screen ──────────────────────────────────────────────
  if (stage === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-dark mb-2">Payment Confirmed!</h2>
          <p className="text-gray-500">Redirecting you to your order...</p>
          <div className="mt-4 flex justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  // ── Failed Screen ───────────────────────────────────────────────
  if (stage === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-dark mb-2">Payment Incomplete</h2>
          <p className="text-gray-500 mb-6">{errorMsg}</p>

          {orderId && (
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 mb-6">
              <p className="font-semibold">Your Order Number</p>
              <p className="text-primary font-bold text-lg">#{orderId}</p>
              <p className="text-xs mt-1 text-gray-400">
                Your order is saved. Contact us if you completed the payment.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setStage('form');
                setErrorMsg('');
                setOrderId(null);
              }}
              className="bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
            >
              Try Again
            </button>
            <Link to="/shop" className="text-gray-500 hover:text-primary transition text-sm">
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Checkout Form ──────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-dark mb-8">Checkout</h1>

      {errorMsg && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600 font-medium">{errorMsg}</p>
        </div>
      )}

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
                <label className="text-sm text-gray-600 mb-1 block">
                  Phone Number *
                  <span className="text-gray-400 ml-1 text-xs font-normal">(Contact number)</span>
                </label>
                <input
                  name="phone"
                  required
                  placeholder="e.g. 0712 345 678"
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
                      Receive an STK push on your phone and enter your PIN to pay.
                    </p>
                  </div>
                </label>

                {/* M-Pesa Phone Field */}
                {paymentMethod === 'mpesa' && (
                  <div className="mx-2 bg-green-50 border border-green-200 rounded-xl p-4">
                    <label className="text-sm font-semibold text-green-800 mb-1 block">
                      📱 M-Pesa Phone Number *
                    </label>
                    <p className="text-xs text-green-600 mb-3">
                      Enter the M-Pesa registered number where you want to receive the STK push.
                      This can be different from your contact number above.
                    </p>
                    <input
                      type="tel"
                      placeholder="e.g. 0712 345 678"
                      value={mpesaPhone}
                      onChange={e => setMpesaPhone(e.target.value)}
                      required={paymentMethod === 'mpesa'}
                      className="w-full border border-green-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-mpesa bg-white text-sm"
                    />
                    <div className="flex items-center gap-2 mt-3">
                      <input
                        type="checkbox"
                        id="same-phone"
                        className="accent-mpesa"
                        checked={mpesaPhone === form.phone && form.phone !== ''}
                        onChange={e => {
                          if (e.target.checked) setMpesaPhone(form.phone);
                          else setMpesaPhone('');
                        }}
                      />
                      <label htmlFor="same-phone" className="text-xs text-green-700 cursor-pointer">
                        Use same number as my contact number above
                      </label>
                    </div>
                  </div>
                )}

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

              <div className="space-y-3 max-h-72 overflow-y-auto">
                {items.map(item => (
                  <div key={item.cartKey} className="flex gap-3 items-start">
                    <img
                      src={item.images?.[0]?.src || 'https://placehold.co/60x60?text=No+Image'}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark line-clamp-1">{item.name}</p>

                      {/* Show variation attributes */}
                      {item.selected_attributes && Object.keys(item.selected_attributes).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {Object.entries(item.selected_attributes).map(([key, value]) => (
                            <span
                              key={key}
                              className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded capitalize"
                            >
                              {value}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-dark flex-shrink-0">
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
                  <span className="text-green-600">TBD</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">KES {getTotal().toLocaleString()}</span>
                </div>
              </div>

              {/* M-Pesa number preview */}
              {paymentMethod === 'mpesa' && mpesaPhone && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3">
                  <p className="text-xs text-green-700 font-semibold">STK Push will be sent to:</p>
                  <p className="text-sm font-bold text-green-800 mt-1">{mpesaPhone}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`mt-6 w-full py-4 rounded-xl text-white font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${
                  paymentMethod === 'mpesa'
                    ? 'bg-mpesa hover:bg-green-700'
                    : 'bg-primary hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : paymentMethod === 'mpesa'
                  ? '📱 Pay with M-Pesa'
                  : '✅ Place Order'}
              </button>

              {paymentMethod === 'mpesa' && (
                <div className="mt-4 bg-green-50 rounded-xl p-3 text-xs text-green-700">
                  <p className="font-semibold mb-1">How it works:</p>
                  <ol className="space-y-1 list-decimal list-inside">
                    <li>Enter your M-Pesa number in the field above</li>
                    <li>Click Pay with M-Pesa</li>
                    <li>STK push sent to your phone</li>
                    <li>Enter your M-Pesa PIN to confirm</li>
                  </ol>
                </div>
              )}

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