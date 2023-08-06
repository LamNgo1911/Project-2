import React from "react";
import {
  FaCcAmazonPay,
  FaCcApplePay,
  FaCcMastercard,
  FaCcPaypal,
  FaCcStripe,
  FaCcVisa,
} from "react-icons/fa";
import image from "../assets/symbol.png";
function Footer() {
  return (
    <div className="grid grid-cols-3 md:grid-cols-5 md:justify-items-center px-8 pt-8 pb-12 gap-8 border-t items-start mb-12 md:mb-0">
      <div className="flex flex-col gap-8 col-span-2 md:col-span-1">
        {/* symbol */}
        <div className="flex flex-row gap-2 items-center">
          <img
            src={image}
            alt="logo"
            className="w-10 h-10 border rounded-full"
          />
          <h1 className="symbol-font">WearMeOut</h1>
        </div>
        <p className="text-sm">
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
          sint. Velit officia consequat duis enim velit mollit.
        </p>
        {/* payments */}
        <div className="flex flex-col gap-4">
          <h1>Accepted Payments</h1>
          <div className="flex flex-wrap w-[70%] gap-4">
            <FaCcAmazonPay className="text-2xl" />
            <FaCcVisa className="text-2xl" />
            <FaCcStripe className="text-2xl" />
            <FaCcMastercard className="text-2xl" />
            <FaCcPaypal className="text-2xl" />
            <FaCcApplePay className="text-2xl" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <h2>Department</h2>
        <div className="text-sm">
          <p>Fashion</p>
          <p>Fashion</p>
          <p>Fashion</p>
          <p>Fashion</p>
          <p>Fashion</p>
          <p>Fashion</p>
          <p>Fashion</p>
          <p>Fashion</p>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <h2>About US</h2>
        <div className="text-sm">
          <p>Fashion</p>
          <p>Fashion</p>
          <p>Fashion</p>
          <p>Fashion</p>
          <p>Fashion</p>
          <p>Fashion</p>
          <p>Fashion</p>
          <p>Fashion</p>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <h2>Services</h2>
        <div className="text-sm">
          <p>Fashion</p>
          <p>Fashion</p>
          <p>Fashion</p>
          <p>Fashion</p>
          <p>Fashion</p>
          <p>Fashion</p>
          <p>Fashion</p>
          <p>Fashion</p>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <h2>Help</h2>
        <div className="text-sm">
          <p>Fashion</p>
          <p>Fashion</p>
          <p>Fashion</p>
          <p>Fashion</p>
          <p>Fashion</p>
          <p>Fashion</p>
          <p>Fashion</p>
          <p>Fashion</p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
