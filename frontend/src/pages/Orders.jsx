import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetCurrentUserOrdersQuery } from "../redux/api/backendApi";
import { imageAxios } from "../axiosApi/imageAxios";

// import Swiper core and required modules
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { setReceivedOrder } from "../redux/service/shoppingSlice";
import { useDispatch, useSelector } from "react-redux";

function Orders() {
  const dispatch = useDispatch();

  const slideData = [
    { title: "All orders", category: "all" },
    { title: "Unpaid", category: "pending" },
    { title: "Processing", category: "paid" },
    { title: "Shipped", category: "shipped" },
    { title: "Review", category: "delivered" },
    { title: "Return", category: "return" },
  ];

  const { receivedOrder } = useSelector((state) => state.shopping);
  const [selectedSlide, setSelectedSlide] = useState(0);
  const { data: orderData, refetch } = useGetCurrentUserOrdersQuery({
    category: slideData[selectedSlide]?.category,
  });

  useEffect(() => {
    refetch();
  }, [receivedOrder]);

  const handleSlideClick = (index) => {
    setSelectedSlide(index);
  };

  return (
    <>
      <div className="flex flex-col gap-8 pb-8 pt-[100px] px-8 orders">
        <div className="flex items-center justify-between">
          <h1 className="md:text-2xl text-xl">Your orders</h1>
        </div>
        <div className="flex flex-col gap-8 ">
          <div className="flex gap-8 items-center flex-wrap border-b text-sm md:text-base">
            <Swiper
              // install Swiper modules
              breakpoints={{
                640: {
                  slidesPerView: 4,
                },
                768: {
                  slidesPerView: 5,
                },
                1024: {
                  slidesPerView: 6,
                },
              }}
              modules={[Navigation]}
              navigation
              spaceBetween={10}
              grabCursor={true}
              slidesPerView={3}
              className={`w-full border-b order-links pl-4`}
            >
              {slideData.map((slide, index) => (
                <SwiperSlide key={index} className="flex justify-start">
                  <p
                    onClick={() => handleSlideClick(index)}
                    className={`cursor-pointer ${
                      selectedSlide === index ? "border-b-2 border-red-500" : ""
                    }`}
                  >
                    {slide.title}
                  </p>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="overflow-x-scroll">
            <table className="border">
              <thead className="bg-[#efefef] text-sm md:text-base">
                <tr>
                  <th>Products</th>
                  <th>Price</th>
                  <th>Commodity operation</th>
                  <th>Status</th>
                  <th>Order operation</th>
                </tr>
              </thead>

              <tbody className="text-xs md:text-sm">
                {orderData?.orders?.length === 0 && (
                  <tr>
                    <td colSpan="5">
                      <div className="h-[20vh] flex justify-center items-center text-center w-full">
                        <h1 className="w-full text-xl md:text-lg">
                          You do not have orders here 😔
                        </h1>
                      </div>
                    </td>
                  </tr>
                )}
                {orderData?.orders?.map((order, i) => (
                  <tr key={order?._id}>
                    <td>
                      <div className="relative">
                        <Swiper
                          modules={[Navigation]}
                          spaceBetween={10}
                          navigation
                          loop={true}
                          grabCursor={true}
                          className="max-w-full max-h-full h-24 w-24 order-images"
                        >
                          {order?.orderItems?.map((item, i) => (
                            <SwiperSlide key={i} className="relative">
                              <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center">
                                <img
                                  src={imageAxios + item?.image}
                                  alt=""
                                  className="object-cover h-14 w-14 max-h-full cursor-pointer"
                                  style={{ maxHeight: "100%" }}
                                />
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                      <p>{order?.orderItems?.length || 0} item(s) </p>
                    </td>
                    <td>{order?.total}$</td>
                    <td>
                      <div>
                        <button className="border px-2 rounded-lg py-1">
                          return item
                        </button>
                        <p className="cursor-pointer">Track</p>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p>
                          {order?.status?.replace(
                            order?.status[0],
                            order?.status[0]?.toUpperCase()
                          )}
                        </p>
                        <Link
                          to={`/orders/${order?._id}`}
                          className="cursor-pointer"
                        >
                          Order details
                        </Link>
                      </div>
                    </td>
                    <td>
                      <div>
                        <button
                          onClick={() => dispatch(setReceivedOrder(order))}
                          className={`border rounded-lg px-2 py-1 ${
                            (order?.status === "delivered" ||
                              order?.status === "reviewed") &&
                            "hidden"
                          }`}
                        >
                          Received
                        </button>

                        <Link
                          to={`/orders/${order?._id}/orderReview`}
                          className={`cursor-pointer border rounded-lg px-2 py-1 bg-[#312c2c] text-white ${
                            order?.status === "delivered" ? "" : "hidden"
                          }`}
                        >
                          Review
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Orders;
