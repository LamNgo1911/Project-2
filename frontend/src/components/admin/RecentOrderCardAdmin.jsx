import React from "react";
import { AiFillEye } from "react-icons/ai";
import { Link } from "react-router-dom";

function RecentOrderCardAdmin({ id, name, img }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <img
          src={img}
          alt=""
          className="md:w-12 md:h-12 w-10 h-10 rounded-lg border object-contain"
        />
        <div className="flex flex-col gap-2">
          <p className="text-sm md:text-base">{name}</p>
          <p className="text-xs md:text-sm">{id}</p>
        </div>
      </div>
      <div className="bg-[#f1edf8] border rounded-lg p-2 font-bold cursor-pointer">
        <Link to={`/admin/orders/${id}`}>
          <AiFillEye className="text-sm md:text-base text-[#0dcaf0]" />
        </Link>
      </div>
    </div>
  );
}

export default RecentOrderCardAdmin;
