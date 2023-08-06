import React, { useEffect, useState } from "react";
import { GiNecklaceDisplay } from "react-icons/gi";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { BiLeftArrowCircle, BiRightArrowCircle } from "react-icons/bi";
import ProductCard from "../components/ProductCard";

function Favorite() {
  const { favoriteItems } = useSelector((state) => state.shopping);
  const { user } = useSelector((state) => state?.auth);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {favoriteItems?.length === 0 ? (
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col items-center justify-center gap-4 px-8">
            <GiNecklaceDisplay className="md:text-[120px] text-[100px] border rounded-full p-4 bg-bg-nav" />
            <h1 className="text-xl md:text-3xl font-semibold">
              Your favorite list is empty
            </h1>
            <p className="text-sm md:text-base text-center">
              You have no items in your favorite list. When you find something
              you like, click the heart to add it here.
            </p>
            <Link
              to="/"
              className="bg-primary text-text-btn border py-2 px-4 rounded-full bg-bg-btn text-base md:text-lg"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8 pb-8 pt-[100px] px-8">
          <div className="flex justify-between items-center col-span-2">
            <h1 className="text-xl md:text-2xl font-bold">
              {favoriteItems?.length} item in your favorite
            </h1>
            <Link
              to="/"
              className="text-xs: md:text-sm hidden md:block border py-2 px-4 rounded-full"
            >
              Continue shopping
            </Link>
          </div>
          {/* products */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {favoriteItems?.map(({ item, isInFavorite }, i) => (
                <ProductCard
                  key={i}
                  category={item?.category?.name}
                  id={item?._id}
                  name={item?.name}
                  price={item?.newPrice}
                  oldPrice={item?.price}
                  description={item?.description}
                  image={item?.colors[0]?.images[0]}
                  colors={item?.colors}
                  sizes={item?.sizes}
                  averageRating={item?.averageRating}
                  numberOfReviews={item?.numberOfReviews}
                  user={item?.user}
                  product={item}
                  isInFavorite={isInFavorite}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Favorite;
