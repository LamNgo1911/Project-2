import React, { useEffect, useRef, useState } from "react";
import { AiOutlineMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { BiLeftArrowCircle, BiRightArrowCircle } from "react-icons/bi";
import { TbTruckReturn } from "react-icons/tb";
import { GrDeliver } from "react-icons/gr";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
// swiper grid
import ReviewCard from "../components/ReviewCard";
import ImageCard from "../components/ImageCard";
import ProductCard from "../components/ProductCard";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetAllProductsPerPageQuery,
  useGetSingleProductQuery,
  useGetSingleProductReviewsQuery,
} from "../redux/api/backendApi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, setSelectedItems } from "../redux/service/shoppingSlice";

function Product() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const errorRef = useRef();
  // pagination
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [limit, setLimit] = useState(10);
  // info
  const [review, setReview] = useState(false);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [sizeError, setSizeError] = useState("");
  const [shakeAnimation, setShakeAnimation] = useState(false);
  const [amount, setAmount] = useState(1);
  const { categoryName, productId } = useParams();
  const uppercaseFirstLetterCategory = categoryName.replace(
    categoryName.charAt(0),
    categoryName.charAt(0).toUpperCase()
  );

  const { data: productData, isfetching } = useGetSingleProductQuery(productId);
  const { data: youMayLikeProductsData, isFetching: isFetchingYoumaylike } =
    useGetAllProductsPerPageQuery({
      category: uppercaseFirstLetterCategory,
    });
  const { data: productReviewsData } = useGetSingleProductReviewsQuery({
    productId,
    page,
    limit,
  });
  console.log(productReviewsData);
  const { recentViewedProducts } = useSelector((state) => state.shopping);
  const { user } = useSelector((state) => state.auth);
  // handle scroll up to the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // -----pagination------
  useEffect(() => {
    setPageCount(productReviewsData?.pagination?.pageCount);
  }, [productReviewsData]);

  const handlePrevious = () => {
    setPage((prePage) => {
      if (prePage === 1) return prePage;
      return prePage - 1;
    });
  };

  const handleNext = () => {
    setPage((prePage) => {
      if (prePage === pageCount) return prePage;
      return prePage + 1;
    });
  };
  // --------------handle active--------------
  useEffect(() => {
    const firstColor = productData?.product?.colors[0]?.color;
    setColor(firstColor);
  }, [productData]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.keyCode === 27) {
        dispatch(setOpenProductModal(false));
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [activeSizeIndex, setActiveSizeIndex] = useState("");
  // --------------handle amount--------------
  const handleDecrement = () => {
    setAmount((pre) => {
      return pre === 1 ? pre : pre - 1;
    });
  };
  const handleIncrement = () => {
    setAmount((pre) => {
      return pre + 1;
    });
  };
  console.log(amount);
  // --------------handle AddTocart--------------
  const handleAddToCart = () => {
    setSizeError(""); // Reset the size error message

    if (!size) {
      setSizeError("Please choose a size!");
      setShakeAnimation(true);

      setTimeout(() => {
        setShakeAnimation(false); // Reset shakeAnimation after a brief delay
      }, 500); // Adjust the delay duration as needed
    } else {
      setSizeError("");
      dispatch(
        addToCart({
          color,
          size,
          id: productData?.product?.id,
          image: productData?.product?.colors?.[activeColorIndex]?.images[0],
          price: productData?.product?.newPrice,
          name: productData?.product?.name,
          amount,
          category: productData?.product?.category?.name,
          userId: user?.id,
        })
      );
    }
  };

  // --------------handle BuyNow--------------

  const handleBuyNow = () => {
    setSizeError(""); // Reset the size error message

    if (!size) {
      setSizeError("Please choose a size!");
      setShakeAnimation(true);

      setTimeout(() => {
        setShakeAnimation(false); // Reset shakeAnimation after a brief delay
      }, 500); // Adjust the delay duration as needed
    } else {
      setSizeError("");
      dispatch(
        setSelectedItems({
          color,
          size,
          id: productData?.product?.id,
          image: productData?.product?.colors?.[activeColorIndex]?.images[0],
          price: productData?.product?.newPrice,
          name: productData?.product?.name,
          amount,
          category: productData?.product?.category?.name,
          userId: user?.id,
        })
      );
      navigate("/checkout");
    }
  };

  const getStarRating = (rating) => {
    const halfStar = "⭑"; // Unicode character for a half star
    const fullStar = "⭐️"; // Unicode character for a full star

    const roundedRating = Math.floor(rating);
    const hasHalfStar = rating - roundedRating >= 0.5;

    let stars = fullStar.repeat(roundedRating); // Full stars

    if (hasHalfStar) {
      stars += halfStar; // Half star emoji
    }

    return stars;
  };

  return (
    <div className="flex flex-col justify-start gap-4 pb-8 mt-[100px] px-8">
      <p className="text-xs md:text-sm">
        <Link to={`/category/${categoryName}`}>
          {uppercaseFirstLetterCategory}
        </Link>{" "}
        /{" "}
        <Link to={`/category/${categoryName}/${productId}`}>
          {productData?.product?.name}
        </Link>{" "}
        {productData?.product?.colors?.length > 1 && " / " + color}
      </p>
      <div className="grid md:grid-cols-2 md:gap-16 gap-8">
        {/* images and review */}
        <div className="flex flex-col gap-8">
          {/* images */}
          <ImageCard
            product={productData?.product}
            color={color}
            colors={productData?.product?.colors}
          />

          {/* review */}
          <div className="flex flex-col gap-8">
            <div
              onClick={() => setReview(!review)}
              className="flex gap-2 items-center cursor-pointer"
            >
              <h1 className="text-lg md:text-xl font-semibold">
                {productReviewsData?.pagination?.count} review(s){" "}
                {getStarRating(productData?.product?.averageRating)}
              </h1>
              {review ? (
                <MdKeyboardArrowDown className="text-2xl" />
              ) : (
                <MdKeyboardArrowDown className="text-2xl transform rotate-180" />
              )}
            </div>
            <div className={`flex-col gap-8 ${review ? "flex" : "hidden"}`}>
              {productReviewsData?.reviews?.map((review, index) => (
                <ReviewCard
                  rating={review?.rating}
                  comment={review?.comment}
                  quality={review?.quality}
                  name={review?.user?.name}
                  date={review?.createdAt}
                  getStarRating={(rating) => getStarRating(rating)}
                />
              ))}
              {/* pagination */}
              <div className="self-center flex gap-4 justify-center items-center pb-8">
                <BiLeftArrowCircle
                  disabled={page === 1}
                  onClick={handlePrevious}
                  className={`text-2xl md:text-3xl cursor-pointer ${
                    page === 1 ? "text-gray-400 hidden" : "block"
                  }`}
                />
                {Array(pageCount)
                  .fill(null)
                  .map((_, index) => {
                    return (
                      <div
                        onClick={() => setPage(index + 1)}
                        key={index}
                        className={`p-4 w-6 h-6 md:w-8 md:h-8  justify-center items-center 
                    rounded-full bg-bg-primary cursor-pointer
                    ${index + 1 === page ? "active" : ""} ${
                          pageCount > 1 ? "flex" : "hidden"
                        }`}
                      >
                        {index + 1}
                      </div>
                    );
                  })}

                <BiRightArrowCircle
                  disabled={page === pageCount}
                  onClick={handleNext}
                  className={`text-2xl md:text-3xl cursor-pointer ${
                    page === pageCount || pageCount === 0
                      ? "text-gray-400 hidden"
                      : "block"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
        {/* details */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 border-b pb-8">
            <h1 className="font-semibold text-lg md:text-xl">
              {productData?.product?.name}
            </h1>
            <p className="text-xs md:text-sm">
              {productData?.product?.description}
            </p>
            <h1 className="font-bold text-xl md:text-2xl">
              ${productData?.product?.newPrice}
            </h1>
          </div>

          {productData?.product?.colors?.length > 1 && (
            <div className="flex flex-col gap-4 border-b pb-8">
              <p className="text-sm md:text-base font-bold">
                Color: <span className="font-normal">{color}</span>
              </p>
              <div className="flex gap-2">
                {productData?.product?.colors?.map(
                  ({ color, images }, index) => {
                    const isActive = index === activeColorIndex;
                    return (
                      <div
                        className={`hover:border-black hover:border-2 rounded-full border-2 ${
                          isActive ? "active-border" : ""
                        }`}
                      >
                        <p
                          key={color}
                          onClick={() => {
                            setColor(color);
                            setActiveColorIndex(index);
                          }}
                          className={`w-10 h-10 md:w-12 md:h-12 border rounded-full cursor-pointer bg-${color
                            ?.split(" ")
                            ?.join("-")}`}
                        />
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 border-b pb-8">
            <div className="flex gap-8">
              <p className="text-sm md:text-base font-bold ">Choose a size</p>
              <div
                ref={errorRef}
                className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
                aria-live="assertive"
              >
                <p>{sizeError}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full">
              {productData?.product?.sizes?.map((size, index) => {
                const isActive = index === activeSizeIndex;

                return (
                  <div
                    className={` ${
                      isActive ? "active-border" : ""
                    } hover:border-black hover:border-2 rounded-full border-2 flex justify-center items-center`}
                  >
                    <p
                      key={index}
                      onClick={() => {
                        setSize(size);
                        setActiveSizeIndex(index);
                      }}
                      className={`flex justify-center border items-center rounded-full
                    py-2 px-4 w-14 h-10 md:text-sm text-xs cursor-pointer hover:border-black ${
                      shakeAnimation && "animate-shake"
                    }`}
                    >
                      {size.toUpperCase()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-8 border-b pb-8">
            <div className="flex gap-8">
              <div className="flex gap-4 items-center text-bg-btn">
                <AiOutlineMinusCircle
                  onClick={handleDecrement}
                  className="cursor-pointer"
                />
                <p>{amount}</p>
                <AiFillPlusCircle
                  onClick={handleIncrement}
                  className="cursor-pointer"
                />
              </div>
              <div className="flex flex-col gap-1 items-start">
                <p className="text-xs md:text-sm">Only 12 Items Left!</p>
                <p className="text-xs md:text-sm">Don't miss it</p>
              </div>
            </div>
            <div className="flex gap-4 justify-between">
              <button
                onClick={handleBuyNow}
                className="border w-full rounded-full px-4 py-2 
                md:text-base text-sm bg-bg-btn text-text-btn cursor-pointer"
              >
                Buy Now
              </button>
              <button
                onClick={handleAddToCart}
                className="border w-full rounded-full px-4 py-2 
                md:text-base text-sm bg-bg-btn cursor-pointer text-text-btn"
              >
                Add to Cart
              </button>
            </div>
          </div>

          <div className="border rounded-lg items-start">
            <div className="flex gap-2 p-2 border-b">
              <GrDeliver />
              <div className="flex flex-col items-start md:text-sm text-xs">
                <p>Free Shipping</p>
                <p>Enter your Postal code for Delivery Availability</p>
              </div>
            </div>
            <div className="flex gap-2 p-2">
              <TbTruckReturn />
              <div className="flex flex-col items-start md:text-sm text-xs">
                <p>Return Delivery</p>
                <p>Free 30 days Delivery returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Items you may like */}
      <div className="flex w-full flex-col justify-start md:gap-8 gap-4 mt-8">
        <h1 className="md:text-2xl text-lg font-bold">Items you may like</h1>
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
          }}
          slidesPerView={2}
          spaceBetween={20}
          scrollbar={{ draggable: true }}
          className="w-full"
        >
          {youMayLikeProductsData?.products?.map((product, i) => {
            return (
              product._id !== productId && (
                <SwiperSlide key={i} className="mb-8">
                  <ProductCard
                    category={product?.category?.name}
                    loading={isFetchingYoumaylike}
                    id={product?.id}
                    name={product?.name}
                    price={product?.newPrice}
                    oldPrice={product?.price}
                    description={product?.description}
                    image={product?.colors[0]?.images[0]}
                    colors={product?.colors}
                    sizes={product?.sizes}
                    averageRating={product?.averageRating}
                    numberOfReviews={product?.numberOfReviews}
                    user={product?.user}
                    product={product}
                  />
                </SwiperSlide>
              )
            );
          })}
        </Swiper>
      </div>
      {/* Recently viewed */}
      <div className="flex flex-col justify-start md:gap-8 gap-4 mt-8">
        <h1 className="md:text-2xl text-lg font-bold"> Recently viewed </h1>
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
          }}
          slidesPerView={2}
          spaceBetween={20}
          scrollbar={{ draggable: true }}
          className="w-full"
        >
          {recentViewedProducts?.map(
            ({ item, isInRecentViewedProducts }, i) => {
              return (
                <SwiperSlide key={i} className="mb-8">
                  <ProductCard
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
                  />
                </SwiperSlide>
              );
            }
          )}
        </Swiper>
      </div>
    </div>
  );
}

export default Product;
