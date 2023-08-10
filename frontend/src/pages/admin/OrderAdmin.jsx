import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiFillCalendar } from "react-icons/ai";
import { useState } from "react";
import { useEffect } from "react";

import { IoMdBarcode } from "react-icons/io";
import { BsPersonCircle } from "react-icons/bs";
import { TbTruckDelivery } from "react-icons/tb";
import { HiLocationMarker } from "react-icons/hi";
import { useGetSingleOrderQuery } from "../../redux/api/backendApi";
import { imageAxios } from "../../axiosApi/imageAxios";
import axios from "../../axiosApi/axios";
import { useSelector } from "react-redux";

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

function OrderAdmin() {
  const {token} = useSelector(state => state.auth)
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState([]);

  const { data: orderData, isFetching, refetch } = useGetSingleOrderQuery(id);

  useEffect(() => {
    setOrder(orderData?.order);
  }, [orderData]);

  const handleMarkAsDelivered = async () => {
    try {
      const { data } = await axios.patch(
        `/orders/${id}/updateOrderStatus`,
        { status: "delivered" },
        {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (data) {
        console.log("successfully updated");
        refetch();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleMarkAsShipped = async () => {
    try {
      const { data } = await axios.patch(
        `/orders/${id}/updateOrderStatus`,
        { status: "shipped" },
        {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (data) {
        console.log("successfully updated");
        refetch();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="pt-[10vh] md:pt-0 px-8 pb-8">
      <div className="flex justify-between pt-8 pb-4">
        <button
          className="text-sm md:text-base font-bold border rounded-lg bg-[#c7b5e3] px-4 py-2"
          onClick={() => navigate("/admin/orders")}
        >
          Back to Orders
        </button>
      </div>

      <div className="border rounded-lg bg-[#fff]">
        <div className="border-b rounded-lg w-full flex justify-between p-4 bg-[#fff]">
          <div>
            <div className="flex gap-4 items-center">
              <AiFillCalendar />
              <p>{order?.createdAt}</p>
            </div>
            <div className="flex gap-4 items-center">
              <IoMdBarcode />
              <p>{order?._id}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 m-4 justify-items-center">
          <div className="p-4 md:justify-self-start border rounded-lg w-full bg-[#f1edf8]">
            <BsPersonCircle className="text-5xl md:text-6xl text-[#198754] mb-4" />
            <p className="text-sm md:text-base font-bold">Customer</p>
            <p className="text-sm md:text-base">{order?.shippingInfo?.name}</p>
            <p className="text-sm md:text-base">
              {order?.shippingInfo?.email}{" "}
            </p>
            <p className="text-sm md:text-base">
              {order?.shippingInfo?.phoneNumber}
            </p>
          </div>

          <div className="p-4 md:justify-self-start border rounded-lg w-full bg-[#f1edf8]">
            <TbTruckDelivery className="text-5xl md:text-6xl text-[#0dcaf0] mb-4" />
            <p className="text-sm md:text-base font-bold">Payment Method</p>
            <p className="text-sm md:text-base">Cash on Delivery</p>
          </div>

          <div className="p-4 md:justify-self-start border rounded-lg w-full bg-[#f1edf8]">
            <HiLocationMarker className="text-5xl md:text-6xl text-[#dc3545] mb-4" />
            <p className="text-sm md:text-base font-bold">Shipping Address</p>
            <p className="text-sm md:text-base">{order?.shippingInfo?.name}</p>
            <p className="text-sm md:text-base">
              {order?.shippingInfo?.StreetAddress},{" "}
              {order?.shippingInfo?.postCode}, {order?.shippingInfo?.city},{" "}
              {order?.shippingInfo?.country}
            </p>
            <p className="text-sm md:text-base">
              {order?.shippingInfo?.phoneNumber}
            </p>
          </div>
        </div>

        <div className="p-4">
          <div className="border rounded-lg w-full overflow-x-scroll">
            <table>
              <thead>
                <tr className="bg-[#c7b5e3]">
                  <th className="text-sm md:text-base font-bold">ID</th>
                  <th className="text-sm md:text-base font-bold">Products</th>
                  <th className="text-sm md:text-base font-bold">Quantity</th>
                  <th className="text-sm md:text-base font-bold">Total</th>
                  <th className="text-sm md:text-base font-bold">Status</th>
                  <th className="text-sm md:text-base font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs md:text-sm">
                {order?.orderItems?.map((item, i) => (
                  <tr key={item._id}>
                    <td>{item?._id}</td>
                    <td>
                      <div className="flex gap-2 justify-start items-center">
                        <div className="md:h-20 md:w-20 h-14 w-14 border">
                          <img
                            src={imageAxios + item?.image}
                            alt=""
                            className="object-fit w-full max-h-full"
                          />
                        </div>
                        <div className="flex flex-col items-start">
                          <p>{item?.name}</p>
                          <p>
                            {item?.color}/{item?.size}
                          </p>
                          <p>{item?.price}$</p>
                        </div>
                      </div>
                    </td>
                    <td>{item?.amount}</td>
                    <td>{item?.price * item?.amount}$</td>
                    {i === 0 && (
                      <td rowSpan={order?.orderItems?.length}>
                        <p
                          className={`rounded-lg p-2 ${getStatusClass(
                            order?.status
                          )}`}
                        >
                          {order?.status}
                        </p>
                      </td>
                    )}
                    {i === 0 && order?.status !== "delivered" && (
                      <td rowSpan={order?.orderItems?.length}>
                        <div className="flex flex-col gap-8">
                          <button
                            onClick={handleMarkAsShipped}
                            className={`py-1 px-2 border rounded-lg bg-[#c7b5e3] ${
                              order?.status === "shipped" && "hidden"
                            }`}
                          >
                            Mark as shipped
                          </button>
                          <button
                            onClick={handleMarkAsDelivered}
                            className="py-1 px-2 border rounded-lg bg-[#c7b5e3]"
                          >
                            Mark as delivered
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderAdmin;
