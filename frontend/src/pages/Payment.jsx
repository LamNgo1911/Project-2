import React, { useEffect, useState } from "react";
import axios from "../axiosApi/axios";
import {
  FaPaypal,
  FaGooglePay,
  FaCcVisa,
  FaCcMastercard,
} from "react-icons/fa";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  resetCart,
  resetSelectedItems,
  setOrder,
} from "../redux/service/shoppingSlice";

function Payment() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [method, setMethod] = useState("");
  const { cartItems, shippingInfo, selectedItems } = useSelector(
    (state) => state.shopping
  );
  const { user, token } = useSelector((state) => state?.auth);
  const shippingFee = 10;
  const tax = 10;

  const handlePaymentMethodSelect = (e) => {
    const value = e.target.value;
    setMethod(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.log("Error creating payment method:", error);
      return;
    }

    const { last4, exp_month, exp_year } = paymentMethod?.card;
    const paymentMethodId = paymentMethod?.id;
    console.log(last4, exp_month, exp_year);

    // Store the card details in local storage or send to the server as needed
    const cardInfo = {
      cardNumber: last4,
      cardExpiry: `${exp_month}/${exp_year}`,
    };

    // Store the cardInfo object in local storage
    sessionStorage.setItem("cardInfo", JSON.stringify(cardInfo));
    // sessionStorage.setItem("paymentMethodId", JSON.stringify(paymentMethodId));
    // Create order
    try {
      console.log(axios)
      const { data } = await axios.post(
        "/orders",
        JSON.stringify({
          cartItems: selectedItems || cartItems,
          tax,
          shippingFee,
          shippingInfo,
          paymentMethodId,
        }),
        {
          headers: { "Content-Type": "application/json",  Authorization: `Bearer ${token}`},
          withCredentials: true,
        }
      );
      if (data) {
        dispatch(setOrder(data));
        dispatch(resetCart({ userId: user?.id }));
        dispatch(resetSelectedItems({ userId: user?.id }));
        // Proceed to review page
        navigate("/review");
      }
    } catch (error) {
      console.log("Error creating order:", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col items-center md:gap-12 gap-4 pb-8 px-8 mt-8 md:w-[60%] w-full mx-auto">
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="flex">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full border bg-gray-300" />
            <div className="h-2 border md:w-36 w-24 bg-gray-300" />
          </div>
          <div className="flex items-center">
            <div className="md:w-8 md:h-8 w-6 h-6 rounded-full border bg-bg-btn" />
            <div className="h-2 border md:w-36 w-24 bg-gray-300" />
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full border bg-gray-300" />
          </div>
        </div>
        <div className="flex justify-between md:gap-24 gap-14">
          <h1 className="text-sm md:text-base ">Shipping</h1>
          <h1 className="text-sm md:text-base ">payment</h1>
          <h1 className="text-sm md:text-base ">review</h1>
        </div>
      </div>

      <div className="flex flex-col gap-2 pb-4 border-b">
        <h1 className="text-2xl md:text-4xl font-bold">
          Choose a payment method
        </h1>
        <p>
          You will not be charged until you review this order on the next page.
        </p>
      </div>

      <div className="flex flex-col justify-center items-center gap-4 md:w-[80%] w-full">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-1">
              <div className="w-7 h-7 border flex items-center justify-center rounded-full">
                <input
                  type="radio"
                  name="payment"
                  value="google-pay"
                  onChange={handlePaymentMethodSelect}
                />
              </div>
              <label htmlFor="payment">Google Pay</label>
            </div>
            <FaGooglePay className="text-3xl md:text-5xl " />
          </div>

          <div className="flex-col gap-4 hidden">
            <p>
              You can complete your order using Google Pay on the "Review" step.
            </p>
            <button
              className="w-full py-2 px-4 rounded-full 
            border bg-bg-btn text-text-btn"
            >
              Review your order
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-1">
            <div
              className={`w-7 h-7 border flex items-center justify-center rounded-full `}
            >
              <input
                type="radio"
                name="payment"
                value="paypal"
                onChange={handlePaymentMethodSelect}
              />
            </div>
            <label htmlFor="payment">Paypal</label>
          </div>
          <FaPaypal className="text-2xl md:text-4xl " />
        </div>

        <div className="flex flex-col gap-4 w-full">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-1">
              <div
                className={`w-7 h-7 border flex items-center justify-center rounded-full `}
              >
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  onChange={handlePaymentMethodSelect}
                />
              </div>
              <label htmlFor="payment">Card</label>
            </div>
            <div className="flex gap-1 items-center">
              <FaCcVisa className="text-2xl md:text-4xl" />
              <FaCcMastercard className="text-2xl md:text-4xl" />
            </div>
          </div>

          <form
            className={`flex-col gap-4 ${
              method === "card" ? "flex" : "hidden"
            }`}
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-2">
              <label
                className="text-base md:text-lg font-bold"
                htmlFor="postal-code"
              >
                Postal code <span className="text-red-500">*</span>
              </label>
              <div>
                <p className="text-xs md:text-sm opacity-[80%]">
                  Make sure to enter the full name that's on your card.
                </p>
                <input
                  className="border-[1.2px] outline-none rounded-lg p-3 shadow-inner w-full"
                  type="text"
                  name="postal-code"
                  id=""
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <p className="text-base md:text-lg font-bold">
                  Card number <span className="text-red-500">*</span>
                </p>
                <CardElement className="border-[1.2px] outline-none rounded-lg p-4 shadow-inner" />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 rounded-full 
              border bg-bg-btn text-text-btn"
              >
                Review your order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Payment;
