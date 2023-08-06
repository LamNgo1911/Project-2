import { Link, useParams } from "react-router-dom";
import React, { useRef } from "react";
import { useState } from "react";
import axios from "../../axiosApi/axios";
import { AiFillExclamationCircle } from "react-icons/ai";

function UpdateDealAdmin() {
  const { id } = useParams();
  // info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");
  // error
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [error, setError] = useState("");
  const errorRef = useRef();

  // handle variable changes
  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    if (!value) {
      setTitleError("Please add code");
      setError("");
    } else {
      setTitleError("");
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

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (title && description && discount) {
      try {
        const { data } = await axios.patch(
          `/deals/${id}`,
          JSON.stringify({
            title,
            description,
            discount,
          }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        if (data) {
          setError("successfully Updated!");

          // Fetch the updated data after addition

          // Reset the input fields
          setTitle("");
          setDiscount("");
          setDescription("");
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
    <div>
      <div className="pt-[10vh] md:pt-0 flex flex-col items-center justify-center my-8 px-8">
        <div className="flex justify-between pt-8 pb-4">
          <Link
            to="/admin/deals"
            className="text-sm md:text-base font-bold border rounded-lg bg-[#ffffff] px-4 py-2"
          >
            Back to deals
          </Link>
        </div>
        {/* add new */}
        <form className="border md:w-[60%] w-full rounded-lg p-4 flex flex-col gap-4 col-span-3 lg:col-span-1 bg-[#fff]">
          <label>
            Title
            {titleError && (
              <div
                ref={errorRef}
                className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
                aria-live="assertive"
              >
                <AiFillExclamationCircle />
                <p>{titleError}</p>
              </div>
            )}
            <div className="relative flex border-[1.2px] rounded-lg p-2 shadow-inner md:text-sm text-xs">
              <input
                onChange={handleTitleChange}
                value={title}
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
                type="text"
                className="w-full outline-none"
              />
            </div>
          </label>
          <label htmlFor="code">
            discount
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
          <button
            onClick={handleUpdate}
            className="bg-[#c7b5e3] border rounded-lg p-2 mt-4 font-bold"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateDealAdmin;
