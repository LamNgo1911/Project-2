import React from "react";
import { useGetSingleCategoryProductsQuery } from "../redux/api/backendApi";
import { imageAxios } from "../axiosApi/imageAxios";
function SibarCategoryCard({ category }) {
  const { data, isFetching, isError } = useGetSingleCategoryProductsQuery(
    category?._id
  );
  // console.log(data);
  return (
    <div className="flex items-center px-2 gap-2 py-2 rounded-lg bg-gradient-to-r from-[#f2e7df] to-[#e5e5e5]">
      <img
        src={imageAxios + category?.image}
        alt="image"
        className="w-12 h-12 border rounded-lg object-fit bg-bg-tag"
      />
      <div className="flex flex-col items-start">
        <h2 className="md:text-base text-sm font-semibold">{category?.name}</h2>
        <div className="flex gap-2 justify-start text-sm">
          <small>{data?.products?.length || 0}</small>
          <small>item(s)</small>
          <small>Available</small>
        </div>
      </div>
    </div>
  );
}

export default SibarCategoryCard;
