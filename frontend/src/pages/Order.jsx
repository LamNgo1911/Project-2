import { useGetSingleOrderQuery } from "../redux/api/backendApi";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { imageAxios } from "../axiosApi/imageAxios";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

function Order() {
  const { id } = useParams();
  const { data: orderData } = useGetSingleOrderQuery(id);

  const date = new Date(orderData?.order?.createdAt);

  // Function to pad single-digit numbers with leading zeroes
  const padZero = (num) => (num < 10 ? "0" + num : num);

  // Get the day, month, and year from the Date object
  const day = padZero(date.getDate());
  const month = padZero(date.getMonth() + 1); // Adding 1 since getMonth() returns 0-11
  const year = date.getFullYear();

  // Construct the "dd/mm/yyyy" formatted date string
  const formattedDate = `${day}/${month}/${year}`;

  console.log(orderData);
  return (
    <div className="flex flex-col gap-8 pb-8 pt-[100px] px-8">
      <div className="text-center">
        <h1 className="mb-8 text-xl md:text-2xl font-bold">ORDER DETAILS</h1>
        <div className="border flex md:flex-row flex-col justify-around py-8">
          <div className="flex flex-col gap-2 w-full pb-8 md:pb-0">
            <p className="text-xs md:text-sm">Order Id.</p>
            <h1 className="text-sm md:text-base font-semibold">
              {orderData?.order?._id}
            </h1>
          </div>
          <div className="flex flex-col gap-2 w-full md:border-l border-t pt-8 md:pt-0 md:border-t-0">
            <p className="text-xs md:text-sm">Date.</p>
            <h1 className="text-sm md:text-base font-semibold">
              {formattedDate}
            </h1>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 text-xs md:text-sm flex-wrap">
        <button className="border px-2 rounded-lg">Repurchase</button>
        <button className="border px-2 rounded-lg">Return Item</button>
        <button className="border px-2 rounded-lg">Review</button>
        <button className="border px-2 rounded-lg">track</button>
        <button className="border px-2 rounded-lg">Received</button>
      </div>
      <div className="overflow-x-scroll">
        <table>
          <thead className="bg-[#efefef] text-sm md:text-base">
            <tr>
              <th>Products</th>
              <th>Quantity</th>
              <th>SKU</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-xs md:text-sm">
            {orderData?.order?.orderItems?.map((item, i) => (
              <tr>
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
                <td>{item?._id}</td>
                <td>{item?.price * item?.amount}$</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Order;
