import { CartItem } from "../../../../types";
import cartModel from "../../../models/cart";
import { CartIcon } from "../../icons";
import CartListItem from "./CartListItem";

const CartList = ({
  cart,
  removeFromCart,
  updateQuantity,
}: {
  cart: CartItem[];
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
}) => {
  return cart.length === 0 ? (
    <div className="text-center py-8">
      <CartIcon size="large" />
      <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
    </div>
  ) : (
    <div className="space-y-3">
      {cart.map((item) => {
        const itemTotal = cartModel.calculateItemTotal(item, cart);
        const originalPrice = item.product.price * item.quantity;
        const hasDiscount = itemTotal < originalPrice;
        const discountRate = hasDiscount ? Math.round((1 - itemTotal / originalPrice) * 100) : 0;

        return (
          <CartListItem
            key={item.product.id}
            item={item}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            hasDiscount={hasDiscount}
            discountRate={discountRate}
            itemTotal={itemTotal}
          />
        );
      })}
    </div>
  );
};

export default CartList;
