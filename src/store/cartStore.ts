import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  images: { edges: { node: { url: string; altText: string | null } }[] };
  variants: { edges: { node: { id: string; title: string; price: { amount: string; currencyCode: string } } }[] };
}

export interface CartItem {
  lineId: string;
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: number;
  quantity: number;
  selectedOptions: { name: string; value: string }[];
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, "lineId">) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
  getCheckoutUrl: () => string;
  syncCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isOpen: false,
      setOpen: (open) => set({ isOpen: open }),
      addItem: (item) => {
        const items = get().items;
        const existing = items.find((i) => i.variantId === item.variantId);
        if (existing) {
          set({
            items: items.map((i) =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({
            items: [...items, { ...item, lineId: `line_${Date.now()}_${Math.random().toString(36).slice(2)}` }],
          });
        }
      },
      updateQuantity: (lineId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(lineId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.lineId === lineId ? { ...i, quantity } : i
          ),
        });
      },
      removeItem: (lineId) => {
        set({ items: get().items.filter((i) => i.lineId !== lineId) });
      },
      clearCart: () => set({ items: [] }),
      getCheckoutUrl: () => {
        // Placeholder — will be replaced with Shopify Storefront API cart creation
        const items = get().items;
        const lineItems = items.map((i) => `${i.variantId.split("/").pop()}:${i.quantity}`).join(",");
        return `https://your-store.myshopify.com/cart/${lineItems}`;
      },
      syncCart: () => {
        // Placeholder for syncing with Shopify cart API
      },
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
