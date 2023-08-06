import React, { useEffect, useState } from "react";
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import CategoryCard from "../components/CategoryCard";
import CouponCard from "../components/CouponCard";
import TrendingCard from "../components/TrendingCard";
import ServiceCard from "../components/ServiceCard";
import { useNavigate } from "react-router-dom";
import {
  useGetAllCategoriesQuery,
  useGetAllCouponsQuery,
  useGetAllDealsQuery,
  useGetAllProductsPerPageQuery,
  useGetTopProductsQuery,
  useGetWeeklyProductsQuery,
} from "../redux/api/backendApi";
import ProductCard from "../components/ProductCard";
import { resetSelectedItems } from "../redux/service/shoppingSlice";
import { useDispatch, useSelector } from "react-redux";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [category, setCategory] = useState("");
  const [trendingCategory, setTrendingCategory] = useState([]);

  const { data: categoriesData } = useGetAllCategoriesQuery();
  const { data: topProducts } = useGetTopProductsQuery();
  const { data: weeklyProducts } = useGetWeeklyProductsQuery();
  const { data: bestProducts, isFetching } = useGetAllProductsPerPageQuery({
    category,
  });
  const { data: mostRatedProducts } = useGetAllProductsPerPageQuery({
    sort: "averageRating",
  });
  const { data: couponsData } = useGetAllCouponsQuery({});
  const { data: dealsData } = useGetAllDealsQuery({});
  const { user } = useSelector((state) => state.auth);
  // scoll to the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // changing category in best products
  useEffect(() => {
    setTrendingCategory(categoriesData?.categories?.slice(0, 2));
    setCategory(categoriesData?.categories?.[0].name);
  }, [categoriesData]);
  // reset SelectedItems
  useEffect(() => {
    dispatch(resetSelectedItems({ userId: user?.id }));
  }, []);

  useEffect(() => {
    const allEl = document.querySelectorAll("[data-target]");

    allEl.forEach((el) => {
      el.addEventListener("click", () => {
        allEl.forEach((item) => {
          if (item.classList.contains("active")) {
            item.classList.remove("active");
          }
        });

        el.classList.add("active");
      });
    });
  }, [categoriesData]);

  return (
    <div className="flex flex-col md:gap-12 gap-8 pb-8">
      {/* cover img */}
      <div
        className="bg-background bg-[50%] md:bg-[100%] md:h-[100vh] h-[60vh] bg-cover w-full flex flex-col 
      justify-center items-start object-contain border px-8 gap-4 "
      >
        <h1 className="md:text-xl text-lg font-extrabold">
          #{couponsData?.coupons?.[0]?.code}
        </h1>
        <p className="symbol-font md:text-4xl text-3xl font-extrabold">
          Up to {couponsData?.coupons?.[0]?.discount}% OFF
        </p>
        <p>{couponsData?.coupons?.[0]?.description}</p>
        <button
          onClick={() => navigate("/deals")}
          className="md:text-base text-sm rounded-full 
        md:px-8 px-4 md:py-4 py-2 bg-bg-btn text-text-btn font-bold"
        >
          Get started
        </button>
      </div>
      {/* category */}
      <div className="flex flex-col justify-start px-8 md:gap-8 gap-4">
        <h1 className="md:text-2xl text-lg font-bold">Shop Our Categories</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {categoriesData?.categories?.map((category, index) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      </div>
      {/* deals */}
      <div className="flex flex-col justify-start px-8 md:gap-8 gap-4">
        <h1 className="md:text-2xl text-lg font-bold">Our top products</h1>
        <Swiper
          // install Swiper modules
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
          }}
          slidesPerView={2}
          spaceBetween={20}
          scrollbar={{ draggable: true }}
          className="w-full"
        >
          {topProducts?.products?.map((product, i) => (
            <SwiperSlide key={product?._id} className="mb-8">
              <ProductCard
                category={product?.category?.name}
                id={product._id}
                colors={product?.colors}
                i={i}
                name={product?.name}
                description={product?.description}
                price={product?.newPrice}
                oldPrice={product?.price}
                product={product}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* Get up to 60% Off */}
      <div className="flex flex-col justify-start px-8 md:gap-8 gap-4">
        <h1 className="md:text-2xl text-lg font-bold">
          Use coupons to save up
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categoriesData?.categories?.map((category, index) => (
            <CouponCard key={index} category={category} />
          ))}
        </div>
      </div>
      {/* Weekly popular products */}
      <div className="flex flex-col justify-start px-8 md:gap-8 gap-4">
        <h1 className="md:text-2xl text-lg font-bold">
          Weekly popular products
        </h1>
        <Swiper
          // install Swiper modules
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
          }}
          slidesPerView={2}
          spaceBetween={20}
          scrollbar={{ draggable: true }}
          className="w-full"
        >
          {weeklyProducts?.products?.map((product, i) => (
            <SwiperSlide key={product._id} className="mb-8">
              <ProductCard
                category={product?.category?.name}
                id={product._id}
                colors={product?.colors}
                i={i}
                name={product?.name}
                description={product?.description}
                price={product?.newPrice}
                oldPrice={product?.price}
                product={product}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* Cash banner */}
      <div
        className="bg-background2 h-[50vh] w-full flex flex-col 
      justify-center items-center sm:items-end bg-cover border px-8 gap-8"
      >
        <div className="flex flex-col gap-4 items-start sm:w-[40%] text-white">
          <h1 className="md:text-2xl text-lg font-bold">
            {dealsData?.deals?.[0]?.title}
          </h1>
          <p className="text-sm md:text-base">
            {dealsData?.deals?.[0]?.description}
          </p>
          <button
            onClick={() => navigate("/deals")}
            className=" rounded-full self-start
              md:px-8 px-4 md:py-4 py-2 bg-bg-btn text-text-btn font-bold md:text-base text-sm
              "
          >
            Explore
          </button>
        </div>
      </div>
      {/* Today's Best Deals For You */}
      <div className="flex flex-col justify-start px-8 md:gap-8 gap-4">
        <h1 className="md:text-2xl text-lg font-bold">
          Today's Best Deals For You
        </h1>
        <div className="flex flex-wrap gap-4 justify-start items-center text-sm md:text-base">
          {
            <p
              onClick={() => setCategory(categoriesData?.categories?.[0]?.name)}
              className="border rounded-full px-4 py-2 cursor-pointer active"
              data-target="nav"
            >
              {categoriesData?.categories?.[0]?.name}
            </p>
          }
          {categoriesData?.categories?.map((category, index) => {
            if (index === 0) return;
            return (
              <p
                onClick={() => setCategory(category?.name)}
                key={index}
                className="border rounded-full px-4 py-2 cursor-pointer"
                data-target="nav"
              >
                {category?.name}
              </p>
            );
          })}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {bestProducts?.products?.map((product, i) => (
            <SwiperSlide key={product._id} className="mb-8">
              <ProductCard
                loading={isFetching}
                category={product?.category?.name}
                id={product._id}
                colors={product?.colors}
                i={i}
                name={product?.name}
                description={product?.description}
                price={product?.newPrice}
                oldPrice={product?.price}
                product={product}
              />
            </SwiperSlide>
          ))}
        </div>
      </div>
      {/* Cash back banner */}
      <div
        className="bg-background3 bg-no-repeat bg-cover h-[50vh] w-full flex flex-col 
      justify-center items-center sm:items-start border px-8 gap-8"
      >
        <div className="flex flex-col gap-4 sm:items-start items-center sm:w-[40%] text-bg-nav">
          <h1 className="md:text-2xl text-lg font-bold">
            {dealsData?.deals?.[1]?.title}
          </h1>
          <p className="text-sm md:text-base">
            {dealsData?.deals?.[1]?.description}
          </p>
          <button
            onClick={() => navigate("/deals")}
            className="md:text-base text-sm rounded-full 
        md:px-8 px-4 md:py-4 py-2 bg-bg-btn text-text-btn font-bold"
          >
            Explore
          </button>
        </div>
      </div>
      {/* Most Rated Products */}
      <div className="flex flex-col justify-start px-8 md:gap-8 gap-4">
        <h1 className="md:text-2xl text-lg font-bold">Most Rated Products</h1>
        <Swiper
          // install Swiper modules
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
          }}
          slidesPerView={2}
          spaceBetween={20}
          scrollbar={{ draggable: true }}
          className="w-full"
        >
          {mostRatedProducts?.products?.map((product, i) => (
            <SwiperSlide key={product._id} className="mb-8">
              <ProductCard
                category={product?.category?.name}
                id={product._id}
                colors={product?.colors}
                i={i}
                name={product?.name}
                description={product?.description}
                price={product?.newPrice}
                oldPrice={product?.price}
                product={product}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* Trending Products For You! */}
      <div className="flex flex-col justify-start px-8 md:gap-8 gap-4">
        <h1 className="md:text-2xl text-lg font-bold">
          Trending Products For You!
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {trendingCategory?.map((cate, index) => (
            <TrendingCard
              key={cate?._id}
              name={cate?.name}
              image={cate?.image}
            />
          ))}
        </div>
      </div>
      {/* services to help you shop */}
      <div className="flex flex-col justify-start px-8 md:gap-8 gap-4">
        <h1 className="md:text-2xl text-lg font-bold">
          Services to help you shop
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <ServiceCard />
          <ServiceCard />
          <ServiceCard />
        </div>
      </div>
    </div>
  );
}

export default Home;
