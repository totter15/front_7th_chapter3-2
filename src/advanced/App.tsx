import { useState, useCallback, useEffect } from "react";
import { CartItem, Coupon, Product } from "../types";
import Header from "./components/Header";
import Notification from "./components/Notification";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import useProducts from "./hooks/useProducts";
import useCart from "./hooks/useCart";
import useCoupons from "./hooks/useCoupons";

export const getRemainingStock = (cart: CartItem[], product: Product): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);

  return remaining;
};

const App = () => {
  const addNotification = useCallback((message: string, type: "error" | "success" | "warning" = "success") => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  const products = useProducts(addNotification);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products.data));
  }, [products.data]);

  const cart = useCart(addNotification);

  useEffect(() => {
    if (cart.data.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart.data));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart.data]);

  const coupons = useCoupons(addNotification);

  useEffect(() => {
    localStorage.setItem("coupons", JSON.stringify(coupons.data));
  }, [coupons.data]);

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 각 도메인 금액 formatter
  const formatPrice = (price: number, productId?: string): string => {
    if (productId) {
      const product = products.data.find((p) => p.id === productId);
      if (product && getRemainingStock(cart.data, product) <= 0) {
        return "SOLD OUT";
      }
    }

    if (isAdmin) {
      return `${price.toLocaleString()}원`;
    }

    return `₩${price.toLocaleString()}`;
  };

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      console.log(productId, newQuantity);
      if (newQuantity <= 0) {
        cart.removeFromCart(productId);
        return;
      }

      const product = products.data.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification(`재고는 ${maxStock}개까지만 있습니다.`, "error");
        return;
      }

      cart.updateQuantity(productId, newQuantity);
    },
    [products.data, cart.removeFromCart, addNotification, cart.updateQuantity]
  );

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, "success");
    cart.clearCart();
    setSelectedCoupon(null);
  }, [addNotification, cart.clearCart]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NOTIFICATIONS */}
      <Notification notifications={notifications} setNotifications={setNotifications} />

      {/* HEADER */}
      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setIsAdmin={setIsAdmin}
        cart={cart.data as CartItem[]}
        totalItemCount={cart.totalItemCount}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            // products
            products={products.data}
            addProduct={products.addProduct}
            updateProduct={products.updateProduct}
            deleteProduct={products.deleteProduct}
            //coupons
            coupons={coupons.data}
            addCoupon={coupons.addCoupon}
            deleteCoupon={coupons.deleteCoupon}
            setSelectedCoupon={setSelectedCoupon}
            selectedCoupon={selectedCoupon}
            // ETC
            formatPrice={formatPrice}
            addNotification={addNotification}
          />
        ) : (
          <CartPage
            // PRODUCTS
            products={products.data}
            // COUPON
            coupons={coupons.data}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            // CART
            cart={cart.data}
            addToCart={cart.addToCart}
            removeFromCart={cart.removeFromCart}
            updateQuantity={updateQuantity}
            // ETC
            completeOrder={completeOrder}
            debouncedSearchTerm={debouncedSearchTerm}
            formatPrice={formatPrice}
            addNotification={addNotification}
          />
        )}
      </main>
    </div>
  );
};

export default App;
