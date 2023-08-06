import React, { useEffect, useRef, useState } from "react";
import {
  FaGooglePay,
  FaCcMastercard,
  FaCcPaypal,
  FaCcVisa,
} from "react-icons/fa";
import { BsBagXFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import CartCard from "../components/CartCard";
import {
  useGetAllCouponsQuery,
  useGetAllProductsPerPageQuery,
} from "../redux/api/backendApi";
import { setOrder } from "../redux/service/shoppingSlice";

function Cart() {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [couponValue, setCouponValue] = useState("");
  const [message, setMessage] = useState("");
  const [subtotal, setSubtotal] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [itemQuatity, setItemQuatity] = useState(null);
  const errorRef = useRef();

  const { cartItems } = useSelector((state) => state.shopping);
  const { user } = useSelector((state) => state.auth);

  const { data: couponData } = useGetAllCouponsQuery({});
  const { data: relevantProducts, isFetching: isFetchingRelevantProducts } =
    useGetAllProductsPerPageQuery({
      category: cartItems[0]?.category,
    });
  // scroll to the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // calculate subtotal
  useEffect(() => {
    const newSubtotal = cartItems.reduce((accumulator, item) => {
      // calculate subtotal for each item
      const itemSubtotal = item?.amount * item?.price;

      // accumulate the subtotal
      return accumulator + itemSubtotal;
    }, 0);

    setSubtotal(newSubtotal - (newSubtotal * (discount || 0)) / 100);

    const newAmount = cartItems.reduce((accumulator, item) => {
      // accumulate the subtotal
      return accumulator + item?.amount;
    }, 0);

    setItemQuatity(newAmount);
  }, [cartItems]);

  const handleApplyCoupon = () => {
    const coupon = couponData?.coupons?.find(
      (coupon) => coupon.code === couponCode
    );

    // Apply coupon logic here
    if (coupon) {
      setMessage(`You have a ${coupon?.discount}% discount`);
      setDiscount(coupon?.discount);
      setCouponValue(coupon);
    } else {
      setMessage(`Invalid coupon`);
    }
    errorRef.current?.focus();
  };

  return (
    <>
      {cartItems?.length > 0 ? (
        <div className="flex flex-col justify-start md:gap-12 gap-4 pb-8 mt-[96px] px-8">
          <div className="flex justify-between items-center col-span-2">
            <h1 className="text-xl md:text-2xl font-bold">
              {cartItems?.length} item in your cart
            </h1>
            <Link className="text-xs: md:text-sm hidden md:block">
              Continue shopping
            </Link>
          </div>
          {/* content */}
          <div className="flex flex-col md:flex-row justify-between gap-8 w-full">
            {/* items details */}
            <div className="flex flex-col gap-8 border rounded-lg p-8 md:w-[60%] h-full w-full">
              <h1 className="col-span-2">Review item(s) and shipping </h1>
              {cartItems?.map((item, index) => (
                <CartCard
                  key={index}
                  name={item?.name}
                  color={item?.color}
                  size={item?.size}
                  price={item?.price}
                  image={item?.image}
                  amount={item?.amount}
                  item={item}
                  userId={user?.id}
                />
              ))}
            </div>
            {/* payment details */}
            <div className="flex flex-col justify-start gap-4 border rounded-lg p-8 md:w-[40%] h-full w-full">
              <h1 className="text-xl md:text-2xl font-bold border-b pb-4">
                Order summary
              </h1>
              {message && (
                <div
                  ref={errorRef}
                  className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
                  aria-live="assertive"
                >
                  <p>{message}</p>
                </div>
              )}
              <div className="flex flex-wrap border rounded-full self-start px-2 py-1 w-full">
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  type="text"
                  name="code"
                  placeholder="Enter Coupon Code"
                  className="rounded-full outline-none px-4 w-full"
                />
              </div>
              <button
                onClick={handleApplyCoupon}
                className="border text-xs md:text-sm rounded-full px-4 py-2 bg-bg-btn text-text-btn"
              >
                Apply coupon
              </button>
              <h1 className="text-xl md:text-2xl font-bold border-b pb-4">
                Accepted Payments
              </h1>
              <div className="flex flex-col gap-2 border-b pb-4">
                <div>Paypal</div>
                <div>Credit and Debit Card</div>
                <div className="flex gap-4 items-center">
                  <FaGooglePay className="text-2xl md:text-4xl" />
                  <FaCcVisa className="text-2xl md:text-4xl" />
                  <FaCcMastercard className="text-2xl md:text-4xl" />
                  <FaCcPaypal className="text-2xl md:text-4xl" />
                </div>
              </div>
              {discount && (
                <div className="flex justify-between items-center border-b pb-4">
                  <p className="">Discount</p>
                  <p className="">{couponValue?.discount}%</p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <p className="">Subtotal ({itemQuatity} item(s))</p>
                <p className="">{subtotal}$</p>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="border rounded-full md:px-8 px-4
                    md:py-4 py-2 bg-bg-btn text-text-btn font-bold text-xs md:text-sm"
              >
                Proceed to checkout
              </button>
            </div>
          </div>

          {/* Items you may like */}
          <div className="flex w-full flex-col justify-start md:gap-8 gap-4 mt-8">
            <h1 className="md:text-2xl text-lg font-bold">
              Discover relevant items
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
              }}
              slidesPerView={2}
              spaceBetween={20}
              scrollbar={{ draggable: true }}
              className="w-full"
            >
              {relevantProducts?.products?.map((product, i) => {
                return (
                  <SwiperSlide key={product?._id} className="mb-8">
                    <ProductCard
                      category={product?.category?.name}
                      loading={isFetchingRelevantProducts}
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
                );
              })}
            </Swiper>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col items-center justify-center gap-4 px-8">
            <BsBagXFill className="md:text-[120px] text-[100px] border rounded-full p-4 bg-bg-nav" />
            <h1 className="text-xl md:text-3xl font-semibold">
              Your cart is empty
            </h1>
            <p className="text-sm md:text-base">
              Looks like you haven't added any items to your cart yet.
            </p>
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

export default Cart;
