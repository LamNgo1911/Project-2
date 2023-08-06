import React, { useEffect, useState } from "react";
import { BiRightArrowCircle, BiLeftArrowCircle } from "react-icons/bi";
import ProductCard from "../components/ProductCard";
import { useGetAllProductsPerPageQuery } from "../redux/api/backendApi";
import { useSelector } from "react-redux";

function SearchResults() {
  // -----pagination-----
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [limit, setLimit] = useState(12);
  const { search } = useSelector((state) => state.info);

  const { data: productsData, isFetching } = useGetAllProductsPerPageQuery({
    page,
    limit,
    search,
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

  return (
    <div className={`flex flex-col gap-8 pb-8 pt-[100px]`}>
      <h1 className="text-xl md:text-2xl font-bold px-8">Search results</h1>
      {/* products */}
      <div className="flex flex-col gap-4 px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {productsData?.products?.map((product, i) => (
            <div key={i}>
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

export default SearchResults;
