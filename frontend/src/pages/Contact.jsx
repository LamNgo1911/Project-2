import React, { useEffect } from "react";
import { GiNecklaceDisplay } from "react-icons/gi";
import { Link } from "react-router-dom";
import contactData from "../data/contactData";

function Contact() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full h-screen pt- border pt-[100px] flex flex-col items-center">
      <div className=" border rounded-lg md:w-[50%] w-[80%] h-[80vh] flex flex-col items-center gap-12 p-8 bg-[#c4dee5]">
        {/* create contact */}
        <h1 className="text-xl md:text-3xl font-semibold">
          {contactData?.title}
        </h1>
        <p className="text-sm md:text-base text-center">
          You can contact us by email:
          <a href="mailto:lamngo606@gmail.com" className="font-bold">
            {" "}
            lamngo606@gmail.com{" "}
          </a>
        </p>
        <div className="flex gap-8 ">
          {contactData?.socials?.map((social, i) => (
            <div>
              <Link to={social?.link}>{social?.icon}</Link>
            </div>
          ))}
        </div>
        <p>Phone: {contactData?.phone}</p>
        <Link
          to="/"
          className="bg-primary text-text-btn border py-2 px-4 rounded-full bg-bg-btn text-base md:text-lg"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default Contact;
