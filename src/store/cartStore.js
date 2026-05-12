import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        const items = get().items;

        // Use variation_id + product id as unique key for variable products
        const cartKey = product.variation_id
          ? `${product.id}-${product.variation_id}`
          : `${product.id}`;

        const existing = items.find(i => i.cartKey === cartKey);

        if (existing) {
          set({
            items: items.map(i =>
              i.cartKey === cartKey
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                ...product,
                cartKey,
                quantity,
              },
            ],
          });
        }
      },

      removeItem: (cartKey) =>
        set({ items: get().items.filter(i => i.cartKey !== cartKey) }),

      updateQuantity: (cartKey, quantity) => {
        if (quantity < 1) return get().removeItem(cartKey);
        set({
          items: get().items.map(i =>
            i.cartKey === cartKey ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () =>
        get().items.reduce(
          (sum, i) => sum + parseFloat(i.price) * i.quantity,
          0
        ),

      getCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'electronics-cart' }
  )
);

export default useCartStore;