import React, { useEffect, useState } from "react";
import CartCard from "../components/CartCard";
import { FaCcVisa } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../axiosApi/axios";

function Review() {
  const [notification, setNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { order } = useSelector((state) => state.shopping);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const cardInfo = JSON.parse(sessionStorage.getItem("cardInfo"));

  const handlePayment = async () => {
    // update order and charge
    try {
      const { data } = await axios.patch(
        `/orders/${order?.order?._id}`,
        JSON.stringify({
          paymentIntentId: order?.paymentIntentId,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (data) {
        setNotification(true);
      }
    } catch (error) {
      setErrorMessage(error.message);
      console.log("Error creating order:", error);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-8 px-8 mt-8 w-full mx-auto">
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="flex">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full border bg-gray-300" />
            <div className="h-2 border md:w-36 w-24 bg-gray-300" />
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full border bg-gray-300" />
            <div className="h-2 border md:w-36 w-24 bg-gray-300" />
          </div>
          <div className="flex items-center">
            <div className="md:w-8 md:h-8 w-6 h-6 rounded-full border bg-bg-btn" />
          </div>
        </div>
        <div className="flex justify-between md:gap-24 gap-14">
          <h1 className="text-sm md:text-base ">Shipping</h1>
          <h1 className="text-sm md:text-base ">payment</h1>
          <h1 className="text-sm md:text-base ">review</h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center md:items-start md:gap-12 gap-4 w-full pb-8">
        <div className="md:w-[60%] border p-8 rounded-lg w-full">
          <div className="flex md:flex-row flex-col items-start w-full gap-4 pb-8 border-b">
            <div className="flex md:flex-row flex-col justify-between gap-12">
              <p>1. Shipping</p>
              <div>
                <p>{order?.order?.shippingInfo?.email}</p>
                <p>{order?.order?.shippingInfo?.name}</p>
                <p>{order?.order?.shippingInfo?.StreetAddress}</p>
                <p>{order?.order?.shippingInfo?.city}</p>
                <p>{order?.order?.shippingInfo?.postcode}</p>
                <p>{order?.order?.shippingInfo?.country}</p>
              </div>
            </div>
            <p className="ml-auto">Edit</p>
          </div>

          <div className="flex md:flex-row flex-col items-start w-full gap-4 pb-8 pt-8 border-b">
            <div className="flex md:flex-row flex-col justify-between gap-12">
              <p>2. Payment</p>
              <div className="flex items-center gap-2">
                <FaCcVisa className="text-2xl md:text-4xl" />
                <div className="flex flex-col gap-1">
                  <p>{cardInfo?.cardNumber}</p>
                  <p>Exp: {cardInfo?.cardExpiry}</p>
                </div>
              </div>
            </div>
            <p className="ml-auto">Edit</p>
          </div>

          <div className="flex flex-col md:gap-12 gap-4 items-start w-full pt-8">
            <p>3. Review your order details</p>
            {order?.order?.orderItems?.map((item, index) => (
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
        </div>

        <div className="flex flex-col justify-start gap-4 border rounded-lg p-8 md:w-[40%] w-full">
          <h1 className="text-xl md:text-2xl font-bold border-b pb-4">
            Order summary
          </h1>
          <div className="flex justify-between items-center">
            <p className="">Item(s) total</p>
            <p className="">{order?.order?.subtotal}$</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="">Shipping</p>
            <p className="">{order?.order?.shippingFee}$</p>
          </div>
          <div className="flex justify-between items-center border-b pb-4">
            <p className="">Tax</p>
            <p className="">{order?.order?.tax}$</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="">Total (1 item)</p>
            <p className="">{order?.order?.total}$</p>
          </div>
          {errorMessage && <div>{errorMessage}</div>}
          <button
            onClick={handlePayment}
            className="border rounded-full md:px-8 px-4
                    md:py-4 py-2 bg-bg-btn text-text-btn font-bold text-xs md:text-sm"
          >
            Submit your order
          </button>
        </div>
      </div>
      {/* Notification */}
      <div
        className={`fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50 ${
          notification ? "block" : "hidden"
        }`}
      >
        <div className="bg-notiImage h-[80%] w-[80%] md:w-[40%] bg-cover bg-[50%] rounded-lg">
          <form className="flex flex-col justify-end gap-4 text-center h-full p-8">
            <h1>Your order has been accepted</h1>
            <p className="text-sm md:text-base">
              You will receive an email confirmation shortly.
            </p>
            <p>Tracking Id: {order?.order?._id}</p>
            <Link
              to="/"
              className="rounded-full md:px-8 px-4
                    md:py-4 py-2 bg-bg-btn text-text-btn font-bold text-xs md:text-sm"
            >
              Continue shopping
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Review;
