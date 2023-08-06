import React from "react";
import { imageAxios } from "../axiosApi/imageAxios";
import { useNavigate } from "react-router-dom";
function CouponCard({ category }) {
  const navigate = useNavigate();

  return (
    <div
      className="md:h-[420px] h-[360px] w-full border rounded-lg cursor-pointer"
      onClick={() => navigate(`/category/${category?.name.toLowerCase()}`)}
    >
      <div className="flex flex-col gap-2 md:gap-4 px-4 justify-center items-start h-[40%]">
        <h2 className="font-semibold text-base md:text-lg">Save up to</h2>
        <h1 className="md:text-4xl text-3xl symbol-font font-extrabold italic">
          $100
        </h1>
        <p className="md:text-base text-sm">Explore our {category?.name}</p>
      </div>
      <div className="h-[60%] max-h-[60%] w-full max-w-full overflow-hidden rounded-b-lg">
        <img
          src={imageAxios + category?.image}
          alt="image"
          className="object-fill hover:scale-110 duration-300 h-full w-full"
        />
      </div>
    </div>
  );
}

export default CouponCard;
