import { useState, useCallback, useEffect } from "react";
import { CartItem, Coupon, Product } from "../types";
import Header from "./components/Header";
import Notification from "./components/Notification";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import useProducts from "./hooks/useProducts";

// 초기 데이터

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

const initialCoupons: Coupon[] = [
  {
    name: "5000원 할인",
    code: "AMOUNT5000",
    discountType: "amount",
    discountValue: 5000,
  },
  {
    name: "10% 할인",
    code: "PERCENT10",
    discountType: "percentage",
    discountValue: 10,
  },
];

const App = () => {
  const products = useProducts();

  const addProduct = (newProduct: Omit<ProductWithUI, "id">) => {
    products.addProduct(newProduct, () => addNotification("상품이 추가되었습니다.", "success"));
  };

  const updateProduct = (productId: string, updates: Partial<ProductWithUI>) => {
    products.updateProduct(productId, updates, () => addNotification("상품이 수정되었습니다.", "success"));
  };

  const deleteProduct = (productId: string) => {
    products.deleteProduct(productId, () => addNotification("상품이 삭제되었습니다.", "success"));
  };

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

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem("coupons");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialCoupons;
      }
    }
    return initialCoupons;
  });

  useEffect(() => {
    localStorage.setItem("coupons", JSON.stringify(coupons));
  }, [coupons]);

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const [isAdmin, setIsAdmin] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // 각 도메인 금액 formatter
  const formatPrice = (price: number, productId?: string): string => {
    if (productId) {
      const product = products.data.find((p) => p.id === productId);
      if (product && getRemainingStock(product) <= 0) {
        return "SOLD OUT";
      }
    }

    if (isAdmin) {
      return `${price.toLocaleString()}원`;
    }

    return `₩${price.toLocaleString()}`;
  };

  const getRemainingStock = (product: Product): number => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    const remaining = product.stock - (cartItem?.quantity || 0);

    return remaining;
  };

  const addNotification = useCallback((message: string, type: "error" | "success" | "warning" = "success") => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  const [totalItemCount, setTotalItemCount] = useState(0);

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(product);
      if (remainingStock <= 0) {
        addNotification("재고가 부족합니다!", "error");
        return;
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.product.id === product.id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            addNotification(`재고는 ${product.stock}개까지만 있습니다.`, "error");
            return prevCart;
          }

          return prevCart.map((item) => (item.product.id === product.id ? { ...item, quantity: newQuantity } : item));
        }

        return [...prevCart, { product, quantity: 1 }];
      });

      addNotification("장바구니에 담았습니다", "success");
    },
    [cart, addNotification, getRemainingStock]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products.data.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification(`재고는 ${maxStock}개까지만 있습니다.`, "error");
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) => (item.product.id === productId ? { ...item, quantity: newQuantity } : item))
      );
    },
    [products.data, removeFromCart, addNotification, getRemainingStock]
  );

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, "success");
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification]);

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
        cart={cart as CartItem[]}
        totalItemCount={totalItemCount}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          // PRODUCTS에 대한 수정, 삭제
          <AdminPage
            // products
            products={products.data}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            //coupons
            coupons={coupons}
            setCoupons={setCoupons}
            formatPrice={formatPrice}
            addNotification={addNotification}
            setSelectedCoupon={setSelectedCoupon}
            selectedCoupon={selectedCoupon}
          />
        ) : (
          <CartPage
            // 공통
            products={products.data}
            debouncedSearchTerm={debouncedSearchTerm}
            coupons={coupons}
            formatPrice={formatPrice}
            addNotification={addNotification}
            // COUPON
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            // cart에 대해서만
            getRemainingStock={getRemainingStock}
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            completeOrder={completeOrder}
          />
        )}
      </main>
    </div>
  );
};

export default App;
