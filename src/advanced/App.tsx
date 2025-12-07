import { useState } from "react";
import Notification from "./components/ui/Notification";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./hooks/useCart";
import { useDebounce } from "./utils/hooks/useDebounce";
import { NotificationProvider } from "./hooks/useNotification";
import { CouponProvider } from "./hooks/useCoupons";
import { ProductProvider } from "./hooks/useProducts";

const AppContent = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 알림 영역 */}
      <Notification />

      {/* 메인 컨텐츠 */}
      {isAdmin ? (
        <AdminPage goShoppingPage={() => setIsAdmin(false)} />
      ) : (
        <CartPage goAdminPage={() => setIsAdmin(true)} />
      )}
    </div>
  );
};

const App = () => {
  return (
    <NotificationProvider>
      <CartProvider>
        <ProductProvider>
          <CouponProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </CouponProvider>
        </ProductProvider>
      </CartProvider>
    </NotificationProvider>
  );
};

export default App;
