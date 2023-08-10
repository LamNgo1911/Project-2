import React, { useEffect, useRef, useState } from "react";
import {
  useGetAllCategoriesQuery,
  useGetAllDealsQuery,
  useGetAllProductsPerPageQuery,
  useGetSingleProductQuery,
} from "../../redux/api/backendApi";
import axios from "../../axiosApi/axios";
import { AiFillExclamationCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

function updateProductAdmin() {
  const { id } = useParams();
  const {token} = useSelector(state => state.auth)
  // data
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const { data: productData } = useGetSingleProductQuery(id);
  const { data: categoriesData } = useGetAllCategoriesQuery();
  const { data: dealsData } = useGetAllDealsQuery({});
  // info
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productColors, setProductColors] = useState([]);
  const [productSizes, setProductSizes] = useState([]);
  const [productDeal, setProductDeal] = useState();
  // error
  const [errorName, setErrorName] = useState("");
  const [errorPrice, setErrorPrice] = useState("");
  const [errorDescription, setErrorDescription] = useState("");
  const [errorImage, setErrorImage] = useState("");
  const [errorCategory, setErrorCategory] = useState("");
  const [errorColors, setErrorColors] = useState("");
  const [errorSizes, setErrorSizes] = useState("");
  const [error, setError] = useState("");

  const { refetch } = useGetAllProductsPerPageQuery({});
  const { categories } = useSelector((state) => state.info);

  const errorRef = useRef();
  const userRef = useRef();

  useEffect(() => {
    userRef?.current?.focus();
  }, []);

  const handleProductNameChange = (e) => {
    const value = e.target.value;

    setProductName(value);
    if (!value) {
      setErrorName("Please add product name!");
    } else {
      setErrorName("");
      setError("");
    }
  };

  const handleProductPriceChange = (e) => {
    const value = e.target.value;

    setProductPrice(value);
    if (!value) {
      setErrorPrice("Please add product price!");
    } else {
      setErrorPrice("");
      setError("");
    }
  };

  const handleProductDescriptionChange = (e) => {
    const value = e.target.value;

    setProductDescription(value);
    if (!value) {
      setErrorDescription("Please add product description!");
    } else {
      setErrorDescription("");
      setError("");
    }
  };

  const uploadImage = async (index, files) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }
    // console.log(formData);
    try {
      const { data } = await axios.post("/products/uploadImage", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      console.log(data);
      if (data) {
        const updatedColors = [...productColors];
        const imageUrls = data?.images;
        updatedColors[index] = { ...updatedColors[index], images: imageUrls };
        // console.log(data);
        setProductColors(updatedColors);
      } else {
        setErrorImage("Image upload failed. Please try again.");
      }
    } catch (error) {
      setErrorImage("An error occurred. Please try again later.");
    }
  };

  const handleProductImageChange = (index, e) => {
    const files = e.target.files;
    // console.log(files);
    if (files.length > 0) {
      console.log("hello");
      uploadImage(index, files);
    }
  };

  const handleProductCategoryChange = (e) => {
    const value = e.target.value;

    setProductCategory(value);
    if (!value) {
      setErrorCategory("Please add product category!");
    } else {
      setErrorCategory("");
      setError("");
    }
  };
  // colors
  const handleProductColorsChange = (index, e) => {
    let value = e.target.value;
    const updatedColors = [...productColors];
    updatedColors[index] = { ...updatedColors[index], color: value };
    setProductColors(updatedColors);

    if (!value) {
      setErrorColors("Please add product colors!");
    } else {
      setErrorColors("");
      setError("");
    }
  };

  const handleAddColor = () => {
    setProductColors([...productColors, { color: "", images: [] }]);
  };

  const handleRemoveColor = (index) => {
    const updatedColors = [...productColors];
    updatedColors.splice(index, 1);
    setProductColors(updatedColors);
  };
  // sizes
  const handleProductSizesChange = (e) => {
    const value = e.target.value;
    // console.log(value);
    setProductSizes((oldProductSizes) => [...oldProductSizes, value]);
    if (productSizes.length < 1) {
      setErrorSizes("Please add product sizes!");
    } else {
      setErrorSizes("");
      setError("");
    }
  };

  const handleProductDealChange = (e) => {
    const value = e.target.value;

    setProductDeal(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      productName ||
      productPrice ||
      productDescription ||
      productCategory ||
      productColors.length > 0 ||
      productSizes.length > 0
    ) {
      const cate = categories?.filter(
        (category) => category?.name === productCategory
      )[0];
      const deal = dealsData?.deals?.filter(
        (deal) => deal?.title === productDeal
      )[0];

      try {
        const { data } = await axios.patch(
          `/products/${id}`,
          JSON.stringify({
            name: productName || productData?.product?.name,
            price: productPrice || productData?.product?.price,
            description:
              productDescription || productData?.product?.description,
            category: cate?._id || productData?.product?.category?._id,
            colors:
              productColors?.length > 0
                ? productColors
                : productData?.product?.colors,
            sizes:
              productSizes?.length > 0
                ? productSizes
                : productData?.product?.sizes,
            deal: deal?._id || productData?.product?.deal?._id,
          }),
          {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`},
            withCredentials: true,
          }
        );

        if (data) {
          setError("successfully updated!");

          // Fetch the updated data after addition
          refetch();
        }
      } catch (error) {
        if (error.reponse) {
          setError("No server response");
        } else {
          setError("Something went wrong");
        }

        errorRef?.current?.focus();
      }
    } else {
      setError("Please add all information!");
    }
  };
  // console.log(productColors);

  return (
    <div className="pt-[10vh] md:pt-0 flex flex-col items-center justify-center my-8 px-8">
      <form className="rounded-lg md:w-[60%] w-full border p-8 bg-[#fff]">
        <h1 className="text-xl md:text-2xl font-bold py-8 text-center">
          Update Product
        </h1>
        <div className="flex flex-col justify-center items-center gap-8">
          <div className="flex flex-col justify-center w-full">
            <label htmlFor="name" className="text-sm md:text-base">
              Name
            </label>
            {!productName && errorName && (
              <div
                ref={errorRef}
                className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
                aria-live="assertive"
              >
                <AiFillExclamationCircle />
                <p>{errorName}</p>
              </div>
            )}
            <input
              ref={userRef}
              onChange={handleProductNameChange}
              value={productName}
              type="text"
              name="name"
              className="w-full outline-none flex border-[1.2px] rounded-lg p-2 shadow-inner text-sm md:text-base"
              placeholder="Name"
            />
          </div>

          <div className="flex flex-col justify-center w-full">
            <label htmlFor="price" className="text-sm md:text-base">
              Price
            </label>
            {!productPrice && errorPrice && (
              <div
                ref={errorRef}
                className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
                aria-live="assertive"
              >
                <AiFillExclamationCircle />
                <p>{errorPrice}</p>
              </div>
            )}
            <input
              onChange={handleProductPriceChange}
              value={productPrice}
              type="number"
              name="price"
              className="w-full outline-none flex border-[1.2px] rounded-lg p-2 shadow-inner text-sm md:text-base"
              placeholder="Price"
            />
          </div>

          <div className="flex flex-col justify-center w-full">
            <label htmlFor="description" className="text-sm md:text-base">
              Description
            </label>
            {!productDescription && errorDescription && (
              <div
                ref={errorRef}
                className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
                aria-live="assertive"
              >
                <AiFillExclamationCircle />
                <p>{errorDescription}</p>
              </div>
            )}
            <textarea
              onChange={handleProductDescriptionChange}
              value={productDescription}
              name="description"
              id=""
              cols="30"
              rows="5"
              className="w-full outline-none flex border-[1.2px] rounded-lg p-2 shadow-inner text-sm md:text-base"
              placeholder="Description"
            ></textarea>
          </div>

          <div className="flex flex-col justify-center w-full">
            <label htmlFor="category" className="text-sm md:text-base">
              Category
            </label>
            {!productCategory && errorCategory && (
              <div
                ref={errorRef}
                className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
                aria-live="assertive"
              >
                <AiFillExclamationCircle />
                <p>{errorCategory}</p>
              </div>
            )}
            <select
              onChange={handleProductCategoryChange}
              value={productCategory}
              name="category"
              className="outline-none flex border-[1.2px] rounded-lg p-2 shadow-inner text-sm md:text-base"
            >
              {categoriesData?.categories?.map((category, i) => (
                <option key={i} value={category?.name}>
                  {category?.name}
                </option>
              ))}
            </select>
          </div>

          {productColors?.map((color, index) => (
            <div key={index} className="flex flex-col gap-8">
              <div className="flex flex-col justify-start w-full">
                <label htmlFor="color" className="text-sm md:text-base">
                  Color
                  <input
                    onChange={(e) => handleProductColorsChange(index, e)}
                    value={color?.color}
                    type="text"
                    name="color"
                    className="w-full outline-none flex border-[1.2px] rounded-lg p-2 shadow-inner text-sm md:text-base"
                    placeholder="Color"
                    required
                  />
                </label>
              </div>

              <div className="flex flex-col justify-center w-full">
                <label htmlFor="image" className="text-sm md:text-base">
                  Image
                  <input
                    onChange={(e) => handleProductImageChange(index, e)} // Pass index parameter
                    accept="image/*"
                    type="file"
                    name="image"
                    className="w-full outline-none flex border-[1.2px] rounded-lg p-2 shadow-inner text-sm md:text-base"
                    placeholder="Image"
                    multiple
                    required
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveColor(index)}
                className="border py-2 px-4 rounded-lg"
              >
                Remove Color
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddColor}
            className="border py-2 px-4 rounded-lg w-full"
          >
            Add Color
          </button>

          <div className="flex flex-col justify-center w-full">
            <label htmlFor="sizes" className="text-sm md:text-base">
              Sizes
            </label>
            {productSizes.length < 1 && errorSizes && (
              <div
                ref={errorRef}
                className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
                aria-live="assertive"
              >
                <AiFillExclamationCircle />
                <p>{errorSizes}</p>
              </div>
            )}

            <div className="flex gap-4">
              {sizes?.map((size, i) => (
                <div key={i} className="flex flex-col justify-center w-full">
                  <div className="self-start">
                    <input
                      onChange={handleProductSizesChange}
                      value={size.toLowerCase()}
                      type="checkbox"
                      name={size}
                      className="w-full outline-none flex border-[1.2px] rounded-lg p-2 shadow-inner text-sm md:text-base"
                    />
                  </div>
                  <label htmlFor={size} className="text-xs md:text-sm">
                    {size}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center w-full">
            <label htmlFor="numReviews" className="text-sm md:text-base">
              Deal
            </label>
            <input
              onChange={handleProductDealChange}
              value={productDeal}
              type="text"
              name="deal"
              className="w-full outline-none flex border-[1.2px] rounded-lg p-2 shadow-inner text-sm md:text-base"
              placeholder="Deal"
            />
            <div
              className="flex flex-row gap-2 text-sm items-center justify-start"
              aria-live="assertive"
            >
              <AiFillExclamationCircle />
              <p>Optional</p>
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
          type="submit"
          onClick={handleSubmit}
          className="bg-[#c7b5e3] border rounded-lg p-2 mt-4 font-bold w-full"
        >
          Update
        </button>
      </form>
    </div>
  );
}

export default updateProductAdmin;
