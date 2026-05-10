import { Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useCartSidebarStore from '../store/cartSidebarStore';

export default function CartSidebar() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const { isOpen, close } = useCartSidebarStore();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={close}
        className={`fixed inset-0 bg-black bg-opacity-50 z-[998] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 max-w-full bg-white z-[999] shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-dark tracking-wide uppercase text-sm">
              Shopping Cart
            </span>
            <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {items.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={close}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-500 hover:text-white transition flex items-center justify-center text-lg font-bold"
          >
            x
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
              <span className="text-6xl">🛒</span>
              <p className="font-medium">Your cart is empty</p>
              <button
                onClick={close}
                className="text-primary hover:underline text-sm"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div>
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex gap-4 p-5 bg-white border-b relative"
                >
                  <div className="flex-shrink-0 w-20 h-20">
                    <img
                      src={item.images?.[0]?.src || 'https://placehold.co/80x80?text=No+Image'}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex-1 pr-6">
                    <Link
                      to={`/product/${item.id}`}
                      onClick={close}
                      className="text-sm font-medium text-dark hover:text-primary transition line-clamp-2"
                    >
                      {item.name}
                    </Link>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition text-gray-600 font-bold text-lg"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition text-gray-600 font-bold text-lg"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-bold text-dark text-sm">
                        KES {(parseFloat(item.price) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 bg-white border-t flex-shrink-0">
            <div className="flex justify-between items-center mb-5">
              <span className="text-gray-500 font-medium uppercase text-sm tracking-wide">
                Subtotal:
              </span>
              <span className="text-xl font-bold text-primary">
                KES {getTotal().toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                to="/cart"
                onClick={close}
                className="block text-center py-3 rounded-full border-2 border-gray-200 font-semibold text-sm hover:border-dark transition"
              >
                VIEW CART
              </Link>
              <Link
                to="/checkout"
                onClick={close}
                className="block text-center py-3 rounded-full bg-primary text-white font-semibold text-sm hover:bg-blue-700 transition"
              >
                CHECKOUT
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}