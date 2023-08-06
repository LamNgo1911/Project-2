import React, { useState } from "react";
import image from "../assets/symbol.png";
import { Link, useNavigate } from "react-router-dom";
import { BiRightArrowCircle } from "react-icons/bi";
import { FaLock } from "react-icons/fa";

function CheckoutSibar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const handleClose = () => {
    setOpen(!open);
  };
  const handleCategory = () => {
    setOpenCategory(!openCategory);
  };

  return (
    // sibar
    <div className="w-full flex flex-row justify-between items-center border px-8 py-4 text-base md:text-lg bg-bg-primary">
      {/* symbol */}
      <div className="flex flex-row justify-between items-center gap-2">
        <Link to="/" className="flex flex-row gap-2 items-center">
          <img
            src={image}
            alt="logo"
            className="md:w-10 md:h-10 w-8 h-8 border rounded-full"
          />
          <h1 className="symbol-font">WearMeOut</h1>
        </Link>
        <p className="text-gray-500 hidden md:block">/</p>
        <div className="items-center gap-2 text-gray-500 hidden md:flex">
          <FaLock className="text-lg md:text-xl" />
          <p className="text-sm md:text-base">Secure checkout</p>
        </div>
      </div>
      <div className="flex gap-2 items-center cursor-pointer">
        <p
          onClick={() => navigate("/")}
          className="text-sm md:text-base hidden md:block"
        >
          Continue shopping
        </p>
        <BiRightArrowCircle className="text-xl md:text-2xl" />
      </div>
    </div>
  );
}

export default CheckoutSibar;
