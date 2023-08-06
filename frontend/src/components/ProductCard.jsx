import React, { useMemo, useState } from "react";

import { AiFillHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { imageAxios } from "../axiosApi/imageAxios";
import {
  setOpenProductModal,
  addToFavorite,
  removefromFavorite,
} from "../redux/service/shoppingSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";
import { setRecentViewedProducts } from "../redux/service/shoppingSlice";
import { setProduct } from "../redux/service/infoSlice";

function ProductCard({
  id,
  colors,
  name,
  price,
  oldPrice,
  product,
  loading,
  category,
  isInFavorite,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const handleAddCart = () => {
    dispatch(setOpenProductModal(true));
    dispatch(setProduct(product));
  };

  const hanldeFavoriteClick = () => {
    if (isInFavorite) {
      dispatch(removefromFavorite({ userId: user?.id, product }));
    } else {
      dispatch(addToFavorite({ userId: user?.id, product }));
    }
  };

  const handleRecentViewedProducts = () => {
    dispatch(setRecentViewedProducts({ userId: user?.id, item: product }));
    navigate(`/category/${category.toLowerCase()}/${id}`);
  };

  return (
    <>
      {loading ? (
        <div className="relative">
          <Loading />
        </div>
      ) : (
        <div className="flex flex-col gap-4 justify-start">
          <div
            className="group/image relative flex flex-row gap-4
       md:h-[280px] md:max-h-[280px] sm:h-[260px] sm:max-h-[260px] h-[180px] max-h-[180px] w-full max-w-full overflow-hidden border rounded-lg"
          >
            <img
              src={imageAxios + colors?.[0]?.images?.[0]}
              className="cursor-pointer hover:scale-110 duration-200 w-full max-w-full h-full max-h-full object-fill"
              onClick={handleRecentViewedProducts}
            />
            <AiFillHeart
              onClick={hanldeFavoriteClick}
              className={`absolute hidden top-3 right-3 border rounded-full 
              text-2xl p-1 md:p-2 md:text-4xl bg-bg-nav cursor-pointer 
              group-hover/image:block ${isInFavorite && "text-red-500"}`}
            />
          </div>
          <h2 className="text-xs md:text-sm">{name}</h2>
          <div className="flex items-center justify-between">
            <p className="text-sm md:text-base font-bold">{price}$</p>
            {price !== oldPrice && (
              <div className="flex items-center gap-2">
                <p className="text-sm md:text-base line-through">{oldPrice}$</p>
                <p className="text-sm md:text-base border rounded-lg p-1 bg-red-500 text-white">
                  -{(100 - (price / oldPrice) * 100).toFixed(0)}%
                </p>
              </div>
            )}
          </div>
          <button
            onClick={handleAddCart}
            className="border rounded-full px-4 
        py-3 bg-bg-btn text-text-btn font-bold self-start text-xs md:text-sm "
          >
            Add to Cart
          </button>
        </div>
      )}
    </>
  );
}

export default ProductCard;
