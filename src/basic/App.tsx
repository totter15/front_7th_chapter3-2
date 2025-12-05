import { useState } from "react";
import Notification from "./components/ui/Notification";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import useProducts from "./hooks/useProducts";
import useCart from "./hooks/useCart";
import useCoupons from "./hooks/useCoupons";
import { useDebounce } from "./utils/hooks/useDebounce";
import { useLocalStorage } from "./utils/hooks/useLocalStorage";
import { useNotification } from "./utils/hooks/useNotification";

const App = () => {
  // Notification 관리
  const { notifications, setNotifications, addNotification } = useNotification();

  // 데이터 관리
  const products = useProducts();
  useLocalStorage("products", products.data);

  const cart = useCart();
  useLocalStorage("cart", cart.data, { removeIfEmpty: true });

  const coupons = useCoupons();
  useLocalStorage("coupons", coupons.data);

  // 상태 관리
  const [isAdmin, setIsAdmin] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 알림 영역 */}
      <Notification notifications={notifications} setNotifications={setNotifications} />

      {/* 메인 컨텐츠 */}
      {isAdmin ? (
        <AdminPage
          products={products.data}
          addProduct={products.addProduct}
          updateProduct={products.updateProduct}
          deleteProduct={products.deleteProduct}
          coupons={coupons.data}
          addCoupon={coupons.addCoupon}
          deleteCoupon={coupons.deleteCoupon}
          selectedCoupon={cart.selectedCoupon}
          setSelectedCoupon={cart.applyCoupon}
          addNotification={addNotification}
          goShoppingPage={() => setIsAdmin(false)}
        />
      ) : (
        <CartPage
          products={products.data}
          cart={cart.data}
          coupons={coupons.data}
          selectedCoupon={cart.selectedCoupon}
          debouncedSearchTerm={debouncedSearchTerm}
          addNotification={addNotification}
          updateQuantity={cart.updateQuantity}
          removeFromCart={cart.removeFromCart}
          applyCoupon={cart.applyCoupon}
          addToCart={cart.addToCart}
          calculateTotal={cart.calculateTotal}
          getRemainingStock={cart.getRemainingStock}
          clearCart={cart.clearCart}
          setSearchTerm={setSearchTerm}
          goAdminPage={() => setIsAdmin(true)}
        />
      )}
    </div>
  );
};

export default App;
