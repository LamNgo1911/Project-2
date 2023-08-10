import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AiFillExclamationCircle } from "react-icons/ai";
import axios from "../../axiosApi/axios";
import { useGetAllCategoriesQuery } from "../../redux/api/backendApi";
import { useSelector } from "react-redux";

function UpdateCategoryAdmin() {
  const { id } = useParams();
  const {token} = useSelector(state => state.auth)
  const { refetch } = useGetAllCategoriesQuery();
  const [categoryName, setCategoryName] = useState("");
  const [validCategoryName, setValidCategoryName] = useState(false);
  const [categoryImage, setCategoryImage] = useState("");
  const [nameError, setNameError] = useState("");
  const [imageError, setImageError] = useState("");
  const [error, setError] = useState("");

  // const { data, isFetching, isError } = useGetAllCategoriesQuery();

  const errorRef = React.useRef();

  const handleCategoryNameChange = (e) => {
    const value = e.target.value;

    setCategoryName(value);
    if (!value) {
      setNameError("Please add category name!");
      setValidCategoryName(false);
    } else {
      setNameError("");
      setError("");
      setValidCategoryName(true);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await axios.post("/categories/uploadImage", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      console.log(data);
      if (data) {
        setCategoryImage(data?.image);
      } else {
        setImageError("Image upload failed. Please try again.");
      }
    } catch (error) {
      setImageError("An error occurred. Please try again later.");
    }
  };

  const handleCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (categoryName && categoryImage) {
      try {
        const { data } = await axios.patch(
          `categories/${id}`,
          JSON.stringify({
            name: categoryName,
            image: categoryImage,
          }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        if (data) {
          setError("successfully updated!");
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
      setError("Please add name and image!");
    }
  };

  return (
    <div className="pt-[10vh] md:pt-0 h-screen flex flex-col items-center my-8 px-8">
      <div className="flex justify-between pt-8 pb-4">
        <Link
          to="/admin/categories"
          className="text-sm md:text-base font-bold border rounded-lg bg-[#ffffff] px-4 py-2"
        >
          Back to categories
        </Link>
      </div>
      <form className="rounded-lg md:w-[60%] w-full border p-8 bg-[#fff]">
        <h1 className="text-xl md:text-2xl font-bold py-8 text-center">
          Update Category
        </h1>
        <div className="flex flex-col justify-center items-center gap-8">
          <div className="flex flex-col justify-center w-full">
            <label htmlFor="name" className="text-sm md:text-base">
              Name
            </label>
            {!validCategoryName && nameError && (
              <div
                ref={errorRef}
                className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
                aria-live="assertive"
              >
                <AiFillExclamationCircle />
                <p>{nameError}</p>
              </div>
            )}
            <div className="relative flex border-[1.2px] rounded-lg p-2 shadow-inner md:text-sm text-xs">
              <input
                value={categoryName}
                type="text"
                className="w-full outline-none"
                onChange={handleCategoryNameChange}
              />
            </div>
          </div>

          <div className="flex flex-col justify-center w-full">
            <label htmlFor="image" className="text-sm md:text-base">
              Image
            </label>
            {imageError && (
              <div
                ref={errorRef}
                className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
                aria-live="assertive"
              >
                <AiFillExclamationCircle />
                <p>{imageError}</p>
              </div>
            )}
            <div className="relative flex border-[1.2px] rounded-lg p-2 shadow-inner md:text-sm text-xs">
              <input
                type="file"
                accept="image/*"
                className="w-full outline-none"
                onChange={handleCategoryImageChange}
              />
            </div>
          </div>
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
        <button
          onClick={handleSubmit}
          type="submit"
          className="bg-[#c7b5e3] border rounded-lg p-2 mt-4 font-bold w-full"
        >
          Update
        </button>
      </form>
    </div>
  );
}

export default UpdateCategoryAdmin;
