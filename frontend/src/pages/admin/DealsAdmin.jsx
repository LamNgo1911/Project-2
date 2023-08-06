import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { useState } from "react";
import { useEffect } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import axios from "../../axiosApi/axios";
import { AiFillExclamationCircle } from "react-icons/ai";
import { useGetAllDealsQuery } from "../../redux/api/backendApi";

const TableCard = ({ id, title, description, discount, refetch }) => {
  // delete a coupon
  const handleDelete = async (e) => {
    try {
      const { data } = await axios.delete(`/deals/${id}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (data) {
        console.log("successfully deleted");
        refetch();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <tbody className="h-full border-t">
      <tr>
        <td className="font-normal text-xs md:text-sm">{id}</td>
        <td className="font-normal text-xs md:text-sm">{title}</td>
        <td className="font-normal text-xs md:text-sm">{description} </td>
        <td className="font-normal text-xs md:text-sm">{discount}%</td>
        <td>
          <div className="flex items-center justify-center gap-2">
            <div className="bg-[#f1edf8] border rounded-lg p-2 font-bold cursor-pointer">
              <Link to={`/admin/deals/${id}/update`}>
                <AiFillEdit className="text-sm md:text-base text-[#0dcaf0]" />
              </Link>
            </div>
            <div
              onClick={handleDelete}
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

function DealsAdmin() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const [count, setCount] = useState(1);
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

  // data
  const { data, isFetching, refetch } = useGetAllDealsQuery({
    page,
    limit,
    search,
  });

  // -----pagination------
  useEffect(() => {
    setPageCount(data?.pagination?.pageCount);
    setCount(data?.pagination?.count);
  }, [data]);

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
  // submit search
  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch("");
  };

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

  const handleAdd = async (e) => {
    e.preventDefault();

    if (title && description && discount) {
      try {
        const { data } = await axios.post(
          "/deals",
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
          setError("successfully created!");

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
    <div className="h-full">
      <div className="pt-[10vh] md:pt-0 px-8 pb-8">
        <div className="grid grid-cols-3 gap-8">
          <div className="flex justify-between pt-8 pb-4  col-span-3">
            <h1 className="text-xl md:text-2xl font-bold">Deals</h1>
          </div>

          <div className="border rounded-lg bg-white col-span-3 lg:col-span-2">
            <div className="border-b w-full flex justify-between p-4">
              <form className="flex border-[1.2px] rounded-lg p-2 shadow-inner md:text-sm text-xs w-[40%]">
                <input
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                  placeholder="Search orders"
                  type="text"
                  className="w-full outline-none "
                  autoComplete="off"
                />
                <Link>
                  <AiOutlineSearch
                    className="text-xl ml-auto text-[#a9a9a9]"
                    onClick={handleSubmit}
                  />
                </Link>
              </form>
            </div>

            <div className="p-4">
              <div className="border rounded-lg w-full overflow-x-scroll">
                <table>
                  <thead>
                    <tr className="bg-[#c7b5e3]">
                      <th className="text-sm md:text-base font-bold">ID</th>
                      <th className="text-sm md:text-base font-bold">Title</th>
                      <th className="text-sm md:text-base font-bold">
                        Description
                      </th>
                      <th className="text-sm md:text-base font-bold">
                        Discount
                      </th>
                      <th className="text-sm md:text-base font-bold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  {data?.deals?.map((deal, index) => (
                    <TableCard
                      refetch={refetch}
                      key={deal?._id}
                      id={deal?._id}
                      title={deal?.title}
                      description={deal?.description}
                      discount={deal?.discount}
                    />
                  ))}
                </table>
              </div>
            </div>

            <div className="px-4">
              {/* pagination */}
              <div className=" flex gap-2 justify-between items-center pb-4 text-xs md:text-sm">
                {/* total */}
                <p className="border rounded-lg p-2 bg-bg-tag">
                  Total: {count}
                </p>

                <div className="flex gap-2 items-center">
                  <button
                    onClick={handlePrevious}
                    className={`p-2 justify-center items-center rounded-lg bg-bg-tag cursor-pointer ${
                      page === 1 ? "hidden" : "flex"
                    }`}
                  >
                    Previous
                  </button>
                  {Array(pageCount)
                    .fill()
                    .map((_, index) => (
                      <div
                        key={index}
                        className={`p-4 w-6 h-6 md:w-8 md:h-8 flex justify-center items-center 
                        rounded-lg bg-bg-tag cursor-pointer ${
                          index + 1 === page ? "active" : ""
                        } ${pageCount > 1 ? "flex" : "hidden"}`}
                      >
                        {index + 1}
                      </div>
                    ))}
                  <button
                    onClick={handleNext}
                    className={`p-2 justify-center items-center rounded-lg bg-bg-tag cursor-pointer ${
                      page === pageCount ? "hidden" : "flex"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* add new */}
          <form className="border rounded-lg p-4 flex flex-col gap-4 col-span-3 lg:col-span-1 bg-[#fff]">
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
              onClick={handleAdd}
              type="submit"
              className="bg-[#c7b5e3] border rounded-lg p-2 mt-4 font-bold"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DealsAdmin;
