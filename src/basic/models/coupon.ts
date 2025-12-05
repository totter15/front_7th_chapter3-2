import { Coupon } from "../../types";
import formatter from "../utils/formatter";

const addCoupon = (coupons: Coupon[], newCoupon: Coupon) => {
  return [...coupons, newCoupon];
};

const deleteCoupon = (coupons: Coupon[], couponCode: string) => {
  return coupons.filter((coupon) => coupon.code !== couponCode);
};

const checkExistingCoupon = (coupons: Coupon[], newCoupon: Coupon) => {
  const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
  return !!existingCoupon;
};

const getCouponList = (coupons: Coupon[]) => {
  return coupons.map((coupon) => ({
    label: `${coupon.name} (${
      coupon.discountType === "amount"
        ? formatter.formatPrice(coupon.discountValue)
        : formatter.formatPercentage(coupon.discountValue)
    })`,
    value: coupon.code,
  }));
};

export default { addCoupon, deleteCoupon, checkExistingCoupon, getCouponList };
