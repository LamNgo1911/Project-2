import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { useState } from "react";
import { useEffect } from "react";
import { AiFillEye, AiFillDelete } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useGetAllOrdersQuery } from "../../redux/api/backendApi";

function getStatusClass(orderStatus) {
  switch (orderStatus) {
    case "delivered":
      return "bg-[#4ba3a7]";
    case "shipped":
      return "bg-[#ffeac9]";
    case "paid":
      return "bg-[#d1e7dd]";
    case "pending":
      return "bg-[#fffcb3]";
    default:
      return "bg-[#e1a9ae]";
  }
}

const TableCard = ({ id, email, items, date, paid, status, total }) => {
  const navigate = useNavigate();

  return (
    <tbody className="h-full border-t">
      <tr>
        <td className="font-normal text-xs md:text-sm">{id}</td>
        <td className="font-normal text-xs md:text-sm">{email}</td>
        <td className="font-normal text-xs md:text-sm">{items}</td>
        <td className="font-normal text-xs md:text-sm">{date}</td>
        <td>
          <div
            className={`py-1 px-2 rounded-lg font-normal text-xs md:text-sm ${getStatusClass(
              status
            )}`}
          >
            {status}
          </div>
        </td>
        <td className="font-normal text-xs md:text-sm">{total}</td>
        <td>
          <div className="flex items-center justify-center gap-2">
            <div
              className="bg-[#f1edf8] border rounded-lg p-2 font-bold cursor-pointer"
              onClick={() => navigate(`/admin/orders/${id}`)}
            >
              <AiFillEye className="text-sm md:text-base text-[#198754]" />
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  );
};

function OrdersAdmin() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [count, setCount] = useState(1);

  const { data, isFetching, refetch } = useGetAllOrdersQuery({
    search,
    limit,
    page,
    status,
  });

  // -----pagination------
  useEffect(() => {
    setOrders(data?.orders);
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

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  console.log(data);
  return (
    <div className="h-screen">
      <div className="pt-[10vh] md:pt-0 px-8 pb-8">
        <div className="flex justify-between pt-8 pb-4">
          <h1 className="text-xl md:text-2xl font-bold">Orders</h1>
        </div>

        <div className="border rounded-lg bg-white">
          <div className="border-b w-full flex justify-between p-4">
            <form className="flex border-[1.2px] rounded-lg p-2 shadow-inner md:text-sm text-xs w-[40%]">
              <input
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                placeholder="Search orders"
                type="text"
                className="w-full outline-none"
              />
              <button onClick={handleSubmit}>
                <AiOutlineSearch className="text-xl ml-auto text-[#a9a9a9] hover:bg-white" />
              </button>
            </form>

            <div className="border rounded-lg flex bg-[#f1edf8] items-center">
              <select
                onChange={(e) => setStatus(e.target.value)}
                name="price"
                className="flex bg-[#f1edf8] items-center border-none outline-none text-xs md:text-sm p-2"
              >
                <option value="">Status</option>
                <option value="pending">pending</option>
                <option value="paid">paid</option>
                <option value="shipped">shipped</option>
                <option value="delivered">delivered</option>
                <option value="return">return</option>
              </select>
            </div>
          </div>

          <div className="p-4">
            <div className="border rounded-lg w-full overflow-x-scroll">
              <table>
                <thead>
                  <tr className="bg-[#c7b5e3]">
                    <th className="text-sm md:text-base font-bold">ID</th>
                    <th className="text-sm md:text-base font-bold">Email</th>
                    <th className="text-sm md:text-base font-bold">Items</th>
                    <th className="text-sm md:text-base font-bold">Date</th>
                    <th className="text-sm md:text-base font-bold">Status</th>
                    <th className="text-sm md:text-base font-bold">Total</th>
                    <th className="text-sm md:text-base font-bold">Actions</th>
                  </tr>
                </thead>
                {orders?.map((order, index) => (
                  <TableCard
                    key={index}
                    id={order?._id}
                    email={order?.shippingInfo?.email}
                    name={order?.name}
                    items={order?.orderItems?.length}
                    paid={order?.isPaid}
                    date={order?.createdAt}
                    status={order?.status}
                    total={order?.total}
                  />
                ))}
              </table>
            </div>
          </div>

          <div className="flex items-center px-4">
            {/* pagination */}
            <div className=" flex gap-2 justify-between items-center pb-4 text-xs md:text-sm">
              {/* total */}
              <p className="border rounded-lg p-2 bg-bg-tag">Total: {count}</p>

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
                    page === pageCount || pageCount === 0 ? "hidden" : "flex"
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

export default OrdersAdmin;
