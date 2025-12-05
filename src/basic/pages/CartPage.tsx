import { useMemo, useCallback } from "react";
import { CartItem, ProductWithUI, Coupon, Product } from "../../types";
import SelectList from "../components/ui/SelectList";
import { CartIcon } from "../components/icons";
import { Card } from "../components/ui";
import CartList from "../components/domain/cartPage/CartList";
import ProductList from "../components/domain/product/ProductList";
import { isValidStock } from "../utils/validators";
import CartHeader from "../components/domain/cartPage/CartHeader";
import cartModel from "../models/cart";
import productModel from "../models/product";
import couponModel from "../models/coupon";

interface CartPageProps {
  products: ProductWithUI[];
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  debouncedSearchTerm: string;

  applyCoupon: (coupon: Coupon | null) => void;
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  removeFromCart: (productId: string) => void;

  getRemainingStock: (product: Product) => number;
  calculateTotal: () => {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  addNotification: (message: string, type: "error" | "success" | "warning") => void;
  clearCart: () => void;
  goAdminPage: () => void;
  setSearchTerm: (value: string) => void;
}

const CartPage = ({
  products,
  cart,
  coupons,
  selectedCoupon,
  debouncedSearchTerm,
  addToCart,
  updateQuantity,
  removeFromCart,
  applyCoupon,
  calculateTotal,
  getRemainingStock,
  addNotification,
  clearCart,
  goAdminPage,
  setSearchTerm,
}: CartPageProps) => {
  const filteredProducts = useMemo(() => {
    if (!debouncedSearchTerm) return products;

    const filteredProducts = productModel.filterSearch(products, debouncedSearchTerm);
    return filteredProducts;
  }, [products, debouncedSearchTerm]);

  const couponList = useMemo(
    () => [{ label: "쿠폰 선택", value: "" }, ...couponModel.getCouponList(coupons)],
    [coupons]
  );

  const totals = calculateTotal();
  const discountAmount = useMemo(() => totals.totalBeforeDiscount - totals.totalAfterDiscount, [totals]);

  const handleApplyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateTotal().totalAfterDiscount;

      // percentage 쿠폰은 최소 주문 금액 체크
      if (currentTotal < 10000 && coupon.discountType === "percentage") {
        addNotification("percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.", "error");
        return;
      }

      applyCoupon(coupon);
      addNotification("쿠폰이 적용되었습니다.", "success");
    },
    [cart, addNotification]
  );

  const handleAddToCart = useCallback(
    (product: Product) => {
      const remainingStock = getRemainingStock(product);

      // 재고 검증
      if (!isValidStock(remainingStock)) {
        addNotification("재고가 부족합니다!", "error");
        return;
      }

      const existingItem = cart.find((item) => item.product.id === product.id);

      // 신규 상품 추가
      if (!existingItem) {
        addToCart(product);
        addNotification("장바구니에 담았습니다", "success");
        return;
      }

      // 기존 상품 수량 증가
      const newQuantity = existingItem.quantity + 1;
      if (newQuantity > product.stock) {
        addNotification(`재고는 ${product.stock}개까지만 있습니다.`, "error");
        return;
      }

      handleUpdateQuantity(product.id, newQuantity);
      addNotification("장바구니에 담았습니다", "success");
    },
    [cart, addNotification, updateQuantity]
  );

  // 수량 업데이트 핸들러
  const handleUpdateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      // 새 수량이 0 이하면 장바구니에서 제거
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      // 상품이 없으면 early return
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      // 재고 초과 검증
      if (newQuantity > product.stock) {
        addNotification(`재고는 ${product.stock}개까지만 있습니다.`, "error");
        return;
      }

      // 수량 업데이트
      updateQuantity(productId, newQuantity);
    },
    [products, cart, addNotification]
  );

  // 주문 완료 핸들러
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, "success");
    clearCart();
    applyCoupon(null);
  }, [addNotification]);

  return (
    <>
      <CartHeader
        goAdminPage={goAdminPage}
        cartCount={cartModel.getCartCount(cart)}
        searchTerm={debouncedSearchTerm}
        setSearchTerm={setSearchTerm}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 상품 목록 영역 */}
          <div className="lg:col-span-3">
            <section>
              {/* 상품 목록 헤더 */}
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
                <div className="text-sm text-gray-600">총 {products.length}개 상품</div>
              </div>

              {/* 상품 목록 또는 검색 결과 없음 메시지 */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">"{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.</p>
                </div>
              ) : (
                <ProductList
                  products={filteredProducts}
                  addToCart={handleAddToCart}
                  getRemainingStock={getRemainingStock}
                />
              )}
            </section>
          </div>

          {/* 장바구니 및 결제 영역 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* 장바구니 카드 */}
              <Card>
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <CartIcon size="small" />
                  장바구니
                </h2>
                <CartList cart={cart} removeFromCart={removeFromCart} updateQuantity={handleUpdateQuantity} />
              </Card>

              {/* 장바구니에 상품이 있을 때만 표시 */}
              {cart.length > 0 && (
                <>
                  {/* 쿠폰 할인 카드 */}
                  <Card>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700">쿠폰 할인</h3>
                      <button className="text-xs text-blue-600 hover:underline">쿠폰 등록</button>
                    </div>
                    {coupons.length > 0 && (
                      <SelectList
                        options={couponList}
                        value={selectedCoupon?.code || ""}
                        onChange={(e) => {
                          const coupon = coupons.find((c) => c.code === e.target.value);
                          if (coupon) {
                            handleApplyCoupon(coupon);
                          } else {
                            applyCoupon(null);
                          }
                        }}
                      />
                    )}
                  </Card>

                  {/* 결제 정보 카드 */}
                  <Card>
                    <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
                    <div className="space-y-2 text-sm">
                      {/* 상품 금액 */}
                      <div className="flex justify-between">
                        <span className="text-gray-600">상품 금액</span>
                        <span className="font-medium">{totals.totalBeforeDiscount.toLocaleString()}원</span>
                      </div>

                      {/* 할인 금액 (할인이 있을 때만 표시) */}
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-red-500">
                          <span>할인 금액</span>
                          <span>-{discountAmount.toLocaleString()}원</span>
                        </div>
                      )}

                      {/* 결제 예정 금액 */}
                      <div className="flex justify-between py-2 border-t border-gray-200">
                        <span className="font-semibold">결제 예정 금액</span>
                        <span className="font-bold text-lg text-gray-900">
                          {totals.totalAfterDiscount.toLocaleString()}원
                        </span>
                      </div>
                    </div>

                    {/* 결제 버튼 */}
                    <button
                      onClick={completeOrder}
                      className="w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors"
                    >
                      {totals.totalAfterDiscount.toLocaleString()}원 결제하기
                    </button>

                    {/* 안내 문구 */}
                    <div className="mt-3 text-xs text-gray-500 text-center">
                      <p>* 실제 결제는 이루어지지 않습니다</p>
                    </div>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default CartPage;
