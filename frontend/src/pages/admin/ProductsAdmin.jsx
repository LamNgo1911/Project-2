import React, { useEffect, useState } from "react";
import { BiLeftArrowCircle, BiRightArrowCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import {
  useGetAllCategoriesQuery,
  useGetAllProductsPerPageQuery,
} from "../../redux/api/backendApi";
import ProductCardAdmin from "../../components/admin/ProductCardAdmin";

function ProductsAdmin() {
  const navigate = useNavigate();
  const [productArray, setProductArray] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(9);
  const [limit, setLimit] = useState(8);
  const [category, setCategory] = useState(
    JSON.parse(sessionStorage.getItem("category")) || "All category"
  );
  const [sort, setSort] = useState(
    JSON.parse(sessionStorage.getItem("sort")) || "Latest added"
  );
  const { data: productsData, isFetching: productsIsFetching } =
    useGetAllProductsPerPageQuery({ page, limit, sort, category });
  const { data: categoriesData } = useGetAllCategoriesQuery();

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

  // console.log(pageCount);
  //------filter------
  useEffect(() => {
    setProductArray(productsData?.products);
  }, [productsData]);

  const handleCategoryFilter = (e) => {
    const value = e.target.value;
    sessionStorage.setItem("category", JSON.stringify(value));
    setCategory(value);
    setPage(1);
  };

  const handleOrderFilter = (e) => {
    const value = e.target.value;
    sessionStorage.setItem("sort", JSON.stringify(value));
    setSort(value);
    setPage(1);
  };

  return (
    <div className="h-full">
      <div className="pt-[10vh] md:pt-0 grid grid-cols-3 gap-8 px-8">
        <div className="flex justify-between items-center col-span-3 pt-8">
          <h1 className="text-xl md:text-2xl font-bold">Products</h1>
          <button
            className="bg-[#fff] border rounded-lg p-2 font-bold"
            onClick={() => navigate("/admin/products/add")}
          >
            Add
          </button>
        </div>
        {/* filter */}
        <div className="flex justify-between items-center col-span-3">
          <div className="border rounded-full flex bg-[#fff] items-center px-4 py-2">
            <select
              onChange={handleCategoryFilter}
              value={category}
              className="border rounded-full flex bg-[#fff] items-center border-none outline-none text-sm md:text-base"
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

          <div className="border rounded-full flex bg-[#fff] items-center px-4 py-2">
            <select
              onChange={handleOrderFilter}
              value={sort}
              className="border rounded-full flex bg-[#fff] items-center border-none outline-none text-sm md:text-base"
            >
              <option value="Latest added">Latest added</option>
              <option value="Lowest price">Lowest price</option>
              <option value="Highest price">Highest price</option>
            </select>
          </div>
        </div>
        {/* products */}
        <div className="col-span-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-full">
          {productArray?.map((product, index) => (
            <div key={product?.id}>
              <ProductCardAdmin
                loading={productsIsFetching}
                id={product?.id}
                name={product?.name}
                price={product?.newPrice}
                oldPrice={product?.price}
                description={product?.description}
                image={product?.colors[0]?.images[0]}
                category={product?.category}
                colors={product?.colors}
                sizes={product?.sizes}
                averageRating={product?.averageRating}
                numberOfReviews={product?.numberOfReviews}
                user={product?.user}
              />
            </div>
          ))}
        </div>
        {/* pagination */}
        <div className="self-center flex gap-4 justify-center items-center pb-8 col-span-3">
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
                  className={`p-4 w-6 h-6 md:w-8 md:h-8 flex justify-center items-center 
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

export default ProductsAdmin;
