import { create } from "zustand";
import { CartItem, ShippingInfo } from "../types/types";
import { persist } from "zustand/middleware";

export interface cartState {
  loading: boolean;
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  shippingInfo: ShippingInfo;
  addToCart: (payload: CartItem) => void;
  removeCartItem: (id: string) => void;
  calculatePrice: () => void;
  applyDiscount: (amount: number) => void;
  saveShippingInfo: (shipping: ShippingInfo) => void;
  resetCart: () => void;
}

const intialState = {
  loading: false,
  cartItems: [],
  subtotal: 0,
  tax: 0,
  shippingCharges: 0,
  discount: 0,
  total: 0,
  shippingInfo: {
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  },
};

export const useCartStore = create<cartState>()(
  persist(
    (set) => ({
      loading: intialState.loading,
      cartItems: intialState.cartItems,
      subtotal: intialState.subtotal,
      tax: intialState.tax,
      shippingCharges: intialState.shippingCharges,
      discount: intialState.discount,
      total: intialState.total,
      shippingInfo: intialState.shippingInfo,
      addToCart: (payload: CartItem) => {
        set((state: cartState) => {
          const index = state.cartItems.findIndex(
            (item) => item.productId === payload.productId
          );
          if (index !== -1) {
            const updatedCartItems = [...state.cartItems];
            updatedCartItems[index] = {
              ...updatedCartItems[index],
              ...payload,
            };
            return { cartItems: updatedCartItems, loading: false };
          }
          return { cartItems: [...state.cartItems, payload], loading: false };
        });
      },
      removeCartItem: (id: string) =>
        set((state: cartState) => ({
          cartItems: state.cartItems.filter(
            (item: CartItem) => item.productId !== id
          ),
          loading: false,
        })),
      calculatePrice: () =>
        set((state: cartState) => {
          const subtotal = state.cartItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          );
          const tax = Math.round(subtotal * 0.18);
          const shippingCharges =
            subtotal > 0 ? (subtotal > 1000 ? 0 : 200) : 0;
          const total = subtotal + tax + shippingCharges - state.discount;
          return {
            subtotal: subtotal,
            tax: tax,
            shippingCharges: shippingCharges,
            total: total,
          };
        }),
      applyDiscount: (amount: number) =>
        set(() => ({
          discount: amount,
        })),
      saveShippingInfo: (shippingData: ShippingInfo) =>
        set(() => ({
          shippingInfo: shippingData,
        })),
      resetCart: () => set(intialState),
    }),

    { name: "cart-storage" }
  )
);

export default useCartStore;
