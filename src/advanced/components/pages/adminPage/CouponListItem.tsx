import { Coupon } from "../../../../types";
import { useCart } from "../../../hooks/useCart";
import { TrashIcon } from "../../icons";

const CouponListItem = ({ coupon, deleteCoupon }: { coupon: Coupon; deleteCoupon: () => void }) => {
  const { selectedCoupon, deleteAppliedCoupon } = useCart(); // CartProvider 에서 제공하는 값
  return (
    <div
      key={coupon.code}
      className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
          <p className="text-sm text-gray-600 mt-1 font-mono">{coupon.code}</p>
          <div className="mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700">
              {coupon.discountType === "amount"
                ? `${coupon.discountValue.toLocaleString()}원 할인`
                : `${coupon.discountValue}% 할인`}
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            if (selectedCoupon?.code === coupon.code) {
              deleteAppliedCoupon();
            }
            deleteCoupon();
          }}
          className="text-gray-400 hover:text-red-600 transition-colors"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default CouponListItem;
