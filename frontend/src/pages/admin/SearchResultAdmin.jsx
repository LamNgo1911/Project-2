import React, { useEffect, useState } from "react";
import { BiLeftArrowCircle, BiRightArrowCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useGetAllProductsPerPageQuery } from "../../redux/api/backendApi";
import ProductCardAdmin from "../../components/admin/ProductCardAdmin";
import { useSelector } from "react-redux";

function SearchResultAdmin() {
  const navigate = useNavigate();
  const { searchAdmin } = useSelector((state) => state.info);
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
    useGetAllProductsPerPageQuery({
      page,
      limit,
      sort,
      category,
      search: searchAdmin,
    });

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

  return (
    <div>
      <div className="pt-[10vh] md:pt-0 grid grid-cols-3 gap-8 px-8">
        <div className="flex justify-between items-center col-span-3 pt-8">
          <h1 className="text-xl md:text-2xl font-bold">Search results</h1>
        </div>
        {/* products */}
        {productArray?.length === 0 && !productsIsFetching && (
          <div className="flex justify-center items-center col-span-3 pt-8">
            <h1 className="text-lg md:text-xl">
              There is no products with "{searchAdmin}" key word 😔
            </h1>
          </div>
        )}
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
              page === pageCount || pageCount === 0
                ? "text-gray-400 hidden"
                : "block"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

export default SearchResultAdmin;
