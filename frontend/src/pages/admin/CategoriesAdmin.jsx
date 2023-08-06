import React, { useEffect, useRef, useState } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "../../axiosApi/axios";
import { imageAxios } from "../../axiosApi/imageAxios";
import { AiFillExclamationCircle } from "react-icons/ai";
import { useGetAllCategoriesQuery } from "../../redux/api/backendApi";
import { useDispatch, useSelector } from "react-redux";
import { setCategories, removeCategory } from "../../redux/service/infoSlice";
import Loading from "../../components/Loading";
import Error from "../../components/Error";

const TableCard = ({ id, image, name }) => {
  const dispatch = useDispatch();
  const { refetch } = useGetAllCategoriesQuery();

  const handleRemoveClick = async (e) => {
    try {
      await axios.delete(`/categories/${id}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      // Remove the deleted category from the local state
      dispatch(removeCategory(id));

      // Fetch the updated data after deletion
      refetch();
    } catch (error) {
      console.log(error);
      // Handle error if necessary
    }
  };

  return (
    <tbody className="h-full border-t">
      <tr>
        <td className="font-normal text-xs md:text-sm">{id}</td>
        <td className="flex items-center justify-center">
          <img
            src={imageAxios + image}
            alt="image"
            className="w-8 h-8 md:w-10 md:h-10 object-contain rounded-lg"
          />
        </td>
        <td className="font-normal text-xs md:text-sm">{name}</td>
        <td>
          <div className="flex items-center justify-center gap-2">
            <Link to={`/admin/categories/${id}/update`}>
              <div className="bg-[#f1edf8] border rounded-lg p-2 font-bold cursor-pointer">
                <AiFillEdit className="text-sm md:text-base text-[#0dcaf0]" />
              </div>
            </Link>
            <div
              onClick={handleRemoveClick}
              className="bg-[#f1edf8] border rounded-lg p-2 font-bold cursor-pointer"
            >
              <AiFillDelete className="text-sm md:text-base text-[#dc3545]" />
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  );
};

function CategoriesAdmin() {
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState("");
  const [imageError, setImageError] = useState("");
  const [nameError, setNameError] = useState("");
  const [error, setError] = useState("");
  const errorRef = useRef();
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.info);

  const { data, isFetching, isError, refetch } = useGetAllCategoriesQuery();

  useEffect(() => {
    dispatch(setCategories(data?.categories));
  }, [data]);

  const handleCategoryNameChange = (e) => {
    const value = e.target.value;
    setCategoryName(value);
    if (!value) {
      setNameError("Please add category name!");
    } else {
      setNameError("");
      setError("");
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await axios.post("/categories/uploadImage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
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
        const { data } = await axios.post(
          "/categories",
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
          setError("successfully created!");

          // Fetch the updated data after addition
          refetch();

          // Reset the input fields
          setCategoryName("");
          setCategoryImage("");
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
    <div className="h-screen">
      <div className="pt-[10vh] md:pt-0 px-8 grid grid-cols-3 gap-8 pb-8">
        <div className="flex justify-between col-span-3 pt-8">
          <h1 className="text-xl md:text-2xl font-bold">Categories</h1>
        </div>

        <div className="w-full border rounded-lg overflow-hidden lg:col-span-2 col-span-3">
          <table>
            <thead>
              <tr className="bg-[#c7b5e3]">
                <th className="text-sm md:text-base font-bold">ID</th>
                <th className="text-sm md:text-base font-bold">Image</th>
                <th className="text-sm md:text-base font-bold">Name</th>
                <th className="text-sm md:text-base font-bold">Actions</th>
              </tr>
            </thead>
            {categories?.map((data, index) => (
              <TableCard
                key={index}
                id={data?._id}
                image={data?.image}
                name={data?.name}
              />
            ))}
          </table>
        </div>
        {/* add new */}
        <form className="border rounded-lg p-4 flex flex-col gap-4 col-span-3 lg:col-span-1 bg-[#fff]">
          <label htmlFor="name">Name</label>
          {nameError && (
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
          <label htmlFor="image">Image</label>
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
            className="bg-[#c7b5e3] border rounded-lg p-2 mt-4 font-bold"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

export default CategoriesAdmin;
