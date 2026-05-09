import { Link, useSearchParams } from 'react-router-dom';

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get('id');
  const method = params.get('method');

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="bg-white rounded-2xl shadow p-10">

        <div className="text-7xl mb-6">🎉</div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Order Placed!
        </h1>

        {orderId && (
          <p className="text-gray-500 mb-4">
            Order #{orderId} has been received.
          </p>
        )}

        {method === 'cod' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
            <p className="font-semibold text-blue-800 mb-1">Cash on Delivery</p>
            <p className="text-sm text-blue-600">
              Please have the exact amount ready when our delivery person arrives.
              We will contact you to confirm your delivery time.
            </p>
          </div>
        )}

        {method !== 'cod' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-left">
            <p className="font-semibold text-green-800 mb-1">M-Pesa Payment</p>
            <p className="text-sm text-green-600">
              Once your M-Pesa payment is confirmed, we will process and deliver your order.
              You will receive an SMS confirmation from us.
            </p>
          </div>
        )}

        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm text-gray-600">
          <p>Questions about your order? Contact us:</p>
          <a href="tel:+254700000000" className="text-primary font-medium hover:underline">
            +254 700 000 000
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to="/shop"
            className="bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="text-gray-500 hover:text-primary transition text-sm"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}