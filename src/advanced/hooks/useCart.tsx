import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import cartModel from "../models/cart";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

interface CartContextType {
  cart: CartItem[];
  selectedCoupon: Coupon | null;
  addToCart: (product: ProductWithUI) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  applyCoupon: (coupon: Coupon | null) => void;
  deleteAppliedCoupon: () => void;
  calculateTotal: () => {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  getRemainingStock: (product: Product) => number;
  clearCart: () => void;
}

interface CartProviderProps {
  children: ReactNode;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  useLocalStorage("cart", cart, { removeIfEmpty: true });

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = useCallback((product: ProductWithUI) => {
    setCart((prevCart) => cartModel.addItemToCart(prevCart, product));
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => cartModel.removeItemFromCart(prevCart, productId));
  }, []);

  const updateQuantity = useCallback((productId: string, newQuantity: number) => {
    setCart((prevCart) => cartModel.updateItemQuantity(prevCart, productId, newQuantity));
  }, []);

  const applyCoupon = useCallback((coupon: Coupon | null) => {
    setSelectedCoupon(coupon);
  }, []);

  const deleteAppliedCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, [selectedCoupon]);

  const calculateTotal = useCallback(() => {
    return cartModel.calculateCartTotal(cart, selectedCoupon);
  }, [cart, selectedCoupon]);

  const getRemainingStock = useCallback(
    (product: Product) => {
      return cartModel.getRemainingStock(cart, product);
    },
    [cart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        selectedCoupon,

        addToCart,
        removeFromCart,
        updateQuantity,
        applyCoupon,
        deleteAppliedCoupon,
        calculateTotal,
        getRemainingStock,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
