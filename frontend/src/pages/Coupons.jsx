import React, { useEffect } from "react";
import { useGetAllCouponsQuery } from "../redux/api/backendApi";
import { RiCoupon5Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
function Coupons() {
  const { data: couponsData } = useGetAllCouponsQuery({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      {couponsData?.coupons?.length > 0 ? (
        <div className="flex flex-col gap-8 pb-8 pt-[100px]">
          {/* coupons */}
          <div className="px-8 grid md:grid-cols-2 gap-8">
            {couponsData?.coupons?.map((coupon, index) => (
              <div
                key={index}
                className="flex flex-col gap-8 border p-4 items-start bg-[#fff6f3] 
            border-t-4 border-t-red-500"
              >
                <div className="flex flex-col text-red-500">
                  <h1 className="font-bold text-xl md:text-2xl">
                    {coupon?.discount}% OFF
                  </h1>
                  <p className="text-sm md:text-base">{coupon?.description}</p>
                  <p className="text-sm md:text-base">Code: {coupon?.code}</p>
                </div>

                <div className="flex flex-col">
                  <p className="text-xs md:text-sm">
                    {new Date(coupon?.expiry)?.toLocaleDateString("en-GB")}
                  </p>
                  <p className="text-xs md:text-sm">Applicable for everyone.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col items-center justify-center gap-4 px-8">
            <RiCoupon5Fill className="md:text-[120px] text-[100px] border rounded-full p-4 bg-bg-nav" />
            <h1 className="text-xl md:text-3xl font-semibold">
              Coupons are empty
            </h1>

            <Link
              to="/"
              className="bg-primary text-text-btn border py-2 px-4 rounded-full bg-bg-btn text-base md:text-lg"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default Coupons;
