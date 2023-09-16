import React, { useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { HiOutlineFilter } from "react-icons/hi";
import { BiRightArrowCircle, BiLeftArrowCircle } from "react-icons/bi";
import ProductCard from "../components/ProductCard";
import {
  useGetAllCategoriesQuery,
  useGetAllDealsQuery,
  useGetAllProductsPerPageQuery,
} from "../redux/api/backendApi";

function Deals() {
  const [showFilter, setShowFilter] = useState(false);
  // -----filter-----
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [limit, setLimit] = useState(12);
  const [category, setCategory] = useState("");
  const [priceOption, setPriceOption] = useState("");
  const [lowestPrice, setLowestPrice] = useState("");
  const [highestPrice, setHighestPrice] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [sort, setSort] = useState("");
  // data
  const [productArray, setProductArray] = useState([]);
  const { data: dealsData } = useGetAllDealsQuery({});
  const { data: categoriesData } = useGetAllCategoriesQuery({});
  const { data: productsData, isFetching } = useGetAllProductsPerPageQuery({
    page,
    limit,
    sort,
    category,
    priceOption,
    lowestPrice,
    highestPrice,
    size,
    color,
  });

  useEffect(() => {
    setProductArray(productsData?.products);
  }, []);
  useEffect(() => {
    setProductArray(productsData?.products);
  }, [productsData]);
  // -----pagination------
  useEffect(() => {
    setPageCount(productsData?.pagination?.pageCount);
  }, [productsData]);

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
  // -----scroll to the top and exit-----
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.keyCode === 27) {
        setShowFilter(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.classList.contains("filter-outside")) {
        setShowFilter(false);
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  // -----handle values change-----
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
  };

  const handlePriceOptionChange = (e) => {
    const value = e.target.value;
    setPriceOption(value);
  };

  const handleLowestPriceChange = (e) => {
    const value = e.target.value;
    setLowestPrice(value);
  };

  const handleHighestPriceChange = (e) => {
    const value = e.target.value;
    setHighestPrice(value);
  };

  const handleSizeChange = (e) => {
    const value = e.target.value;
    setSize(value);
  };

  const handleColorChange = (e) => {
    const value = e.target.value;
    setColor(value);
  };

  const handleOrderFilter = (e) => {
    const value = e.target.value;
    setSort(value);
    setPage(1);
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    setShowFilter(false);
    setCategory("");
    setPriceOption("");
    setLowestPrice("");
    setHighestPrice("");
    setSize("");
    setColor("");
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-8 pb-8 pt-[100px]">
      {/* deals */}
      <div className="px-8">
        <h1 className="text-xl md:text-2xl font-bold">
          Up to {dealsData?.deals?.[0]?.discount}% off
        </h1>
        <p className="text-sm md:text-base">
          {dealsData?.deals?.[0]?.description}
        </p>
      </div>
      {/* tags */}
      <div className="flex gap-4 items-center justify-between px-8">
        <div
          onClick={() => setShowFilter(!showFilter)}
          className="border rounded-full px-4 py-[5px] flex items-center bg-bg-tag items-c enter cursor-pointer"
        >
          <span className="mr-2 text-sm md:text-base">All Filters</span>
          <HiOutlineFilter className="text-base md:text-sm" />
        </div>
        {/* filter fixed */}
        <div
          className={`filter-outside fixed h-screen w-full max-w-[1280px] left-1/2 -translate-x-1/2 mx-auto z-[9998] top-0 bg-black bg-opacity-50 ${
            showFilter ? "block" : "hidden"
          }`}
        >
          <form className="w-[80%] h-full max-h-[100vh] md:w-[40%] bg-bg-nav py-8 flex justify-between overflow-y-scroll">
            <div className="flex flex-col gap-8 items-start px-8">
              <h1 className="text-2xl md:text-4xl font-bold">Filters</h1>
              {/* Filter by category */}
              <div className="flex flex-col gap-2 w-full">
                <p className="text-sm md:text-base">Filter by category</p>
                <div className="py-2 px-4 rounded-full w-full border-2">
                  <select
                    onChange={handleCategoryChange}
                    value={category}
                    className="outline-none w-full bg-bg-nav"
                  >
                    <option value="All category">All category</option>
                    {categoriesData?.categories?.map((category) => {
                      return (
                        <option key={category?.name} value={category?.name}>
                          {category?.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              {/* Filter by price */}
              <div className="flex flex-col gap-2 w-full">
                <p>Filter by price</p>
                <div className="flex items-center gap-4">
                  <input
                    onChange={handlePriceOptionChange}
                    value="Any price"
                    type="radio"
                    name="price"
                    className="border-2"
                  />
                  <label>Any price</label>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    onChange={handlePriceOptionChange}
                    value="Custom"
                    type="radio"
                    name="price"
                    className="border-2"
                  />
                  <label>Custom</label>
                </div>
                <div className="flex justify-between gap-4 items-center">
                  <input
                    onChange={handleLowestPriceChange}
                    value={lowestPrice}
                    type="text"
                    placeholder="Low"
                    className="outline-none rounded-full border-2 py-2 p-4 w-[50%] bg-bg-nav"
                  />
                  <p>to</p>
                  <input
                    onChange={handleHighestPriceChange}
                    value={highestPrice}
                    type="text"
                    placeholder="High"
                    className="outline-none rounded-full border-2 py-2 p-4 w-[50%] bg-bg-nav"
                  />
                </div>
              </div>
              {/* Filter by size */}
              <div className="flex flex-col gap-2 w-full">
                <p>Filter by size</p>
                <div className="py-2 px-4 rounded-full w-full border-2">
                  <select
                    onChange={handleSizeChange}
                    value={size}
                    className="outline-none w-full bg-bg-nav"
                  >
                    <option value="">Any size</option>
                    <option value="S">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </div>
              </div>
              {/* Filter by color */}
              <div className="flex flex-col gap-2 w-full">
                <p>Filter by color</p>
                <div className="py-2 px-4 rounded-full w-full border-2">
                  <select
                    onChange={handleColorChange}
                    value={color}
                    className="outline-none w-full bg-bg-nav"
                  >
                    <option value="">Any color</option>
                    <option value="black">black</option>
                    <option value="white">white</option>
                    <option value="red">red</option>
                    <option value="blue">blue</option>
                    <option value="green">green</option>
                    <option value="khaki">khaki</option>
                  </select>
                </div>
              </div>
              {/* button */}
              <div className="w-full flex gap-8 py-2">
                <button
                  onClick={handleCancelClick}
                  className="w-full text-base md:text-lg py-2 px-4 border rounded-full bg-bg-btn text-text-btn font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
          {/* close */}
          <AiFillCloseCircle
            onClick={() => setShowFilter(false)}
            className="text-3xl z-[9999] text-gray-500 absolute md:left-[35%] left-[70%] top-5 cursor-pointer"
          />
        </div>
        {/* sort by */}
        <div className="border rounded-full flex bg-bg-tag items-center px-4 py-2">
          <select
            value={sort}
            onChange={handleOrderFilter}
            name="sort"
            className="border rounded-full flex bg-bg-tag items-center border-none outline-none text-sm md:text-base"
          >
            <option value="Most Relevant">Most Relevant</option>
            <option value="Lowest price">Lowest price</option>
            <option value="Highest price">Highest price</option>
            <option value="Most recent">Most recent</option>
            <option value="Top reviews">Top reviews</option>
          </select>
        </div>
      </div>
      {/* products */}
      <div className="flex flex-col gap-4 px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {productArray?.map((product, index) => (
            <div key={product?.id}>
              <ProductCard
                category={product?.category?.name}
                loading={isFetching}
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
            </div>
          ))}
        </div>

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
              page === pageCount ? "text-gray-400 hidden" : "block"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

export default Deals;
