import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { useState } from "react";
import { useEffect } from "react";
import { useGetAllUsersQuery } from "../../redux/api/backendApi";
import axios from "../../axiosApi/axios";
import { useSelector } from "react-redux";

const TableCard = ({ id, name, email, role, date, status }) => {
  const {token} = useSelector(state => state.auth)
  const [show, setShow] = useState(false);
  const modelRef = React.useRef(null);
  useEffect(() => {
    const handler = (event) => {
      if (!modelRef.current?.contains(event.target)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const handleAction = async () => {
    if (status) {
      try {
        await axios.post(`user/${id}/disable`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
      } catch (error) {
        console.log(error.message);
      }
    } else {
      try {
        await axios.post(`user/${id}/activate`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
      } catch (error) {
        console.log(error.message);
      }
    }
  };
  return (
    <tbody className="h-full border-t">
      <tr>
        <td className="font-normal text-xs md:text-sm">{id}</td>
        <td className="font-normal text-xs md:text-sm">{role}</td>
        <td className="font-normal text-xs md:text-sm">{email}</td>
        <td className="font-normal text-xs md:text-sm">{name}</td>
        <td className="font-normal text-xs md:text-sm">{date}</td>
        <td className="font-normal text-xs md:text-sm">
          <p
            className={`rounded-lg p-2 ${
              status ? "bg-[#d1e7dd]" : "bg-[#e1a9ae]"
            }`}
          >
            {status ? "active" : "disabled"}
          </p>
        </td>
        <td>
          <button
            onClick={handleAction}
            className={`rounded-lg p-2 font-normal text-xs md:text-sm ${
              status ? "bg-[#e1a9ae]" : "bg-[#d1e7dd]"
            }`}
          >
            {status ? "disable" : "activate"}
          </button>
        </td>
      </tr>
    </tbody>
  );
};

function UsersAdmin() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(1);

  const { data, isFetching, refetch } = useGetAllUsersQuery({
    page,
    limit,
    filter,
    search,
  });
  console.log(data);
  // -----pagination------
  useEffect(() => {
    setPageCount(data?.pagination?.pageCount);
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
  };

  return (
    <div className="h-screen">
      <div className="pt-[10vh] md:pt-0 px-8 pb-8">
        <div className="flex justify-between pt-8 pb-4">
          <h1 className="text-xl md:text-2xl font-bold">Users</h1>
        </div>

        <div className="border rounded-lg bg-white">
          <div className="border-b w-full flex justify-between p-4">
            <form
              onSubmit={handleSubmit}
              className="flex border-[1.2px] rounded-lg p-2 shadow-inner md:text-sm text-xs w-[40%]"
            >
              <input
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                placeholder="Search users"
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

            <div className="flex items-center">
              <select
                onChange={(e) => setFilter(e.target.value)}
                value={filter}
                name="price"
                className="border rounded-lg flex items-center outline-none text-xs md:text-sm p-2"
              >
                <option value="Status">Status</option>
                <option value="Active">Active</option>
                <option value="Disabled">Disabled</option>
                <option value="Show all">Show all</option>
              </select>
            </div>
          </div>

          <div className="p-4">
            <div className="border rounded-lg w-full overflow-x-scroll">
              <table>
                <thead>
                  <tr className="bg-[#c7b5e3]">
                    <th className="text-sm md:text-base font-bold">ID</th>
                    <th className="text-sm md:text-base font-bold">Role</th>
                    <th className="text-sm md:text-base font-bold">Email</th>
                    <th className="text-sm md:text-base font-bold">Name</th>
                    <th className="text-sm md:text-base font-bold">Date</th>
                    <th className="text-sm md:text-base font-bold">Status</th>
                    <th className="text-sm md:text-base font-bold">Action</th>
                  </tr>
                </thead>
                {data?.users?.map((data, index) => (
                  <TableCard
                    key={index}
                    id={data?._id}
                    email={data?.email}
                    name={data?.name}
                    role={data?.role}
                    date={data?.createdAt}
                    status={data?.status}
                  />
                ))}
              </table>
            </div>
          </div>

          <div className="px-4">
            {/* pagination */}
            <div className="flex gap-2 items-center justify-between pb-4 text-xs md:text-sm">
              {/* total */}
              <p className="border rounded-lg p-2 bg-bg-tag">
                Total: {data?.pagination?.count}
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
      </div>
    </div>
  );
}

export default UsersAdmin;
