import React, { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import axios from "../../axiosApi/axios";
import { AiFillExclamationCircle } from "react-icons/ai";
import { useGetAllCouponsQuery } from "../../redux/api/backendApi";

function UpdateCouponAdmin() {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiry, setExpiry] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [description, setDescription] = useState("");
  const errorRef = useRef();
  const { id } = useParams();
  // error
  const [codeError, setCodeError] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [expiryError, setExpiryError] = useState("");
  const [minAmountError, setMinAmountError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [error, setError] = useState("");
  // fetching data
  const { refetch } = useGetAllCouponsQuery(1, 10, "", "");
  // handle change
  const handleCodeChange = (e) => {
    const value = e.target.value;
    setCode(value);
    if (!value) {
      setCodeError("Please add code");
      setError("");
    } else {
      setCodeError("");
    }
  };
  const handleDiscountChange = (e) => {
    const value = e.target.value;
    setDiscount(value);
    if (!value) {
      setDiscountError("Please add discount");
      setError("");
    } else {
      setDiscountError("");
    }
  };
  const handleExpiryChange = (e) => {
    const value = e.target.value;
    setExpiry(value);
    if (!value) {
      setExpiryError("Please add expiry");
      setError("");
    } else {
      setExpiryError("");
    }
  };
  const handleMinAmountChange = (e) => {
    const value = e.target.value;
    setMinAmount(value);
    if (!value) {
      setMinAmountError("Please add min amount");
      setError("");
    } else {
      setMinAmountError("");
    }
  };
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    if (!value) {
      setDescriptionError("Please add description");
      setError("");
    } else {
      setDescriptionError("");
    }
  };
  // hanlde add button
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (code && discount && expiry && minAmount && description) {
      try {
        const { data } = await axios.patch(
          `/coupons/${id}`,
          JSON.stringify({
            code,
            discount,
            expiry,
            minAmount,
            description,
          }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        if (data) {
          setError("successfully updated!");

          // Fetch the updated data after addition

          // Reset the input fields
          setCode("");
          setDiscount("");
          setExpiry("");
          setMinAmount("");
          setDescription("");
          // refetch coupon data
          refetch();
        }
      } catch (error) {
        if (error.reponse) {
          setError("No server response");
        } else {
          setError("Something went wrong");
          console.log(error);
        }

        errorRef?.current?.focus();
      }
    } else {
      setError("Please add all information!");
    }
  };

  return (
    <div className="h-screen">
      <div className="pt-[10vh] md:pt-0 flex flex-col items-center justify-center my-8 px-8">
        <div className="flex justify-between pt-8 pb-4">
          <Link
            to="/admin/coupons"
            className="text-sm md:text-base font-bold border rounded-lg bg-[#ffffff] px-4 py-2"
          >
            Back to coupons
          </Link>
        </div>
        <form className="rounded-lg md:w-[60%] w-full border p-8 bg-[#fff]">
          <h1 className="text-xl md:text-2xl font-bold py-8 text-center">
            Update Coupon
          </h1>
          <div className="flex flex-col justify-center gap-8 w-full">
            <div className="flex flex-col gap-4">
              <label>
                Code
                {codeError && (
                  <div
                    ref={errorRef}
                    className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
                    aria-live="assertive"
                  >
                    <AiFillExclamationCircle />
                    <p>{codeError}</p>
                  </div>
                )}
                <div className="relative flex border-[1.2px] rounded-lg p-2 shadow-inner md:text-sm text-xs">
                  <input
                    onChange={handleCodeChange}
                    value={code}
                    type="text"
                    className="w-full outline-none"
                  />
                </div>
              </label>
              <label>
                Discount
                {discountError && (
                  <div
                    ref={errorRef}
                    className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
                    aria-live="assertive"
                  >
                    <AiFillExclamationCircle />
                    <p>{discountError}</p>
                  </div>
                )}
                <div className="relative flex border-[1.2px] rounded-lg p-2 shadow-inner md:text-sm text-xs">
                  <input
                    onChange={handleDiscountChange}
                    value={discount}
                    type="text"
                    className="w-full outline-none"
                  />
                </div>
              </label>
              <label htmlFor="code">
                Expiry
                {expiryError && (
                  <div
                    ref={errorRef}
                    className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
                    aria-live="assertive"
                  >
                    <AiFillExclamationCircle />
                    <p>{expiryError}</p>
                  </div>
                )}
                <div className="relative flex border-[1.2px] rounded-lg p-2 shadow-inner md:text-sm text-xs">
                  <input
                    onChange={handleExpiryChange}
                    value={expiry}
                    type="date"
                    className="w-full outline-none"
                  />
                </div>
              </label>
              <label>
                Min amount
                {minAmountError && (
                  <div
                    ref={errorRef}
                    className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
                    aria-live="assertive"
                  >
                    <AiFillExclamationCircle />
                    <p>{minAmountError}</p>
                  </div>
                )}
                <div className="relative flex border-[1.2px] rounded-lg p-2 shadow-inner md:text-sm text-xs">
                  <input
                    onChange={handleMinAmountChange}
                    value={minAmount}
                    type="text"
                    className="w-full outline-none"
                  />
                </div>
              </label>
              <label>
                Description
                {descriptionError && (
                  <div
                    ref={errorRef}
                    className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
                    aria-live="assertive"
                  >
                    <AiFillExclamationCircle />
                    <p>{descriptionError}</p>
                  </div>
                )}
                <div className="relative flex border-[1.2px] rounded-lg p-4 shadow-inner md:text-sm text-xs">
                  <textarea
                    onChange={handleDescriptionChange}
                    value={description}
                    type="textarea"
                    className="w-full outline-none"
                  />
                </div>
              </label>
            </div>
            {error && (
              <div
                ref={errorRef}
                className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
                aria-live="assertive"
              >
                <AiFillExclamationCircle />
                <p>{error}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleUpdate}
            className="bg-[#c7b5e3] border rounded-lg p-2 mt-4 font-bold w-full"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateCouponAdmin;
