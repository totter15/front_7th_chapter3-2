import { Coupon } from "../../../../types";
import CouponListItem from "./CouponListItem";
import CouponForm from "./CouponForm";
import { useState } from "react";
import couponModel from "../../../models/coupon";

const CouponSection = ({
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  deleteCoupon,
  addNotification,
  addCoupon,
}: {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  deleteCoupon: (couponCode: string) => void;
  addNotification: (message: string, type: "error" | "success" | "warning") => void;
  addCoupon: (coupon: Coupon) => void;
}) => {
  const [couponForm, setCouponForm] = useState({
    name: "",
    code: "",
    discountType: "amount" as "amount" | "percentage",
    discountValue: 0,
  });
  const [showCouponForm, setShowCouponForm] = useState(false);

  //coupon
  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isExistingCoupon = couponModel.checkExistingCoupon(coupons, couponForm);
    if (isExistingCoupon) {
      addNotification("이미 존재하는 쿠폰 코드입니다.", "error");
      return;
    }

    addCoupon(couponForm);
    setCouponForm({
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
    });
    setShowCouponForm(false);
    addNotification("쿠폰이 추가되었습니다.", "success");
  };

  const handleDeleteCoupon = (couponCode: string) => {
    deleteCoupon(couponCode);
    addNotification("쿠폰이 삭제되었습니다.", "success");
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <CouponListItem
              key={coupon.code}
              coupon={coupon}
              selectedCoupon={selectedCoupon}
              setSelectedCoupon={setSelectedCoupon}
              deleteCoupon={handleDeleteCoupon}
            />
          ))}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
            <button
              onClick={() => setShowCouponForm(!showCouponForm)}
              className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
            </button>
          </div>
        </div>

        {showCouponForm && (
          <CouponForm
            couponForm={couponForm}
            setCouponForm={setCouponForm}
            handleCouponSubmit={handleCouponSubmit}
            setShowCouponForm={setShowCouponForm}
            addNotification={addNotification}
          />
        )}
      </div>
    </section>
  );
};

export default CouponSection;
