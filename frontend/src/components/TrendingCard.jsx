import React from "react";
import { imageAxios } from "../axiosApi/imageAxios";
import { useNavigate } from "react-router-dom";

function TrendingCard({ name, image }) {
  const navigate = useNavigate();
  return (
    <div className="h-[420px] w-full border rounded-lg">
      <div className="h-[60%] max-h-[60%] max-w-full overflow-hidden rounded-t-lg">
        <img
          src={imageAxios + image}
          alt="image"
          className="h-full w-full bg-bg-tag object-cover hover:scale-110 duration-200"
        />
      </div>
      <div className="flex flex-col gap-4 justify-center items-start px-4 h-[40%]">
        <h2 className="font-semibold text-lg md:text-xl">{name}</h2>
        <p className="text-sm md:text-base">Delivery with in 24 hours</p>
        <button
          onClick={() => navigate(`/category/${name?.toLowerCase()}`)}
          className="border rounded-full md:px-8 px-4 
        md:py-4 py-2 bg-bg-btn text-text-btn font-bold text-xs md:text-sm"
        >
          Shop Now
        </button>
      </div>
    </div>
  );
}

export default TrendingCard;
