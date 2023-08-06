import React, { useEffect, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import image from "../../assets/symbol.png";
import { BiCategory, BiLogOut } from "react-icons/bi";
import { BsBox, BsCalendar, BsCart } from "react-icons/bs";
import { RiCouponLine } from "react-icons/ri";
import { GrContact } from "react-icons/gr";
import { FiSettings } from "react-icons/fi";
import { RxPerson } from "react-icons/rx";
import { useDispatch } from "react-redux";
import axios from "../../axiosApi/axios";
import { getUser } from "../../redux/service/authSlice";

const navigationLinks = [
  {
    to: "/admin",
    icon: <AiOutlineHome className="text-xl" />,
    name: "Dashboard",
  },
  {
    to: "/admin/categories",
    icon: <BiCategory className="text-xl" />,
    name: "Categories",
  },
  {
    to: "/admin/products",
    icon: <BsBox className="text-xl" />,
    name: "Products",
  },
  {
    to: "/admin/orders",
    icon: <BsCart className="text-xl" />,
    name: "Orders",
  },
  {
    to: "/admin/users",
    icon: <RxPerson className="text-xl" />,
    name: "Users",
  },
  {
    to: "/admin/coupons",
    icon: <BsCalendar className="text-xl" />,
    name: "Coupons",
  },
  {
    to: "/admin/deals",
    icon: <RiCouponLine className="text-xl" />,
    name: "Deals",
  },
  {
    to: "/admin/contact",
    icon: <GrContact className="text-xl" />,
    name: "Contact",
  },
];

const otherLinks = [
  {
    to: "/admin/settings",
    icon: <FiSettings className="text-xl" />,
    name: "Settings",
  },
  {
    to: "/admin/logout",
    icon: <BiLogOut className="text-xl" />,
    name: "Logout",
  },
];

const AdminNavLink = ({ icon, name, to, active }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // handle logout
  const handleClick = async () => {
    if (name === "Logout") {
      try {
        const response = await axios.get("/auth/logout", {
          withCredentials: true,
        });
        if (response) {
          console.log(response);
          dispatch(getUser({}));
          navigate("/login");
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`nav-admin navbar py-2 rounded-lg px-8 ${
        active ? "nav-admin-active" : ""
      }`}
    >
      <Link to={to} className="flex jus gap-2">
        {icon}
        <h1 className="text-sm">{name}</h1>
      </Link>
    </div>
  );
};

function SidebarAdmin() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className={`hidden md:flex flex-col gap-4 px-4 w-[30%] border-r
        lg:w-[10%]"
      }`}
    >
      {/* symbol */}
      <div className="flex justify-between items-center h-[10vh] px-4">
        <Link to="/" className="flex flex-row gap-2 items-center">
          <img src={image} alt="logo" className="w-8 h-8 rounded-full" />
          <h1 className="symbol-font text-base">WearMeOut</h1>
        </Link>
      </div>

      <div className="flex flex-col gap-4 items-start">
        <h1 className="text-lg font-bold px-4">Menu</h1>
        <div className="flex flex-col gap-4 font-medium">
          {navigationLinks.map((link) => (
            <AdminNavLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              name={link.name}
              active={link.to === location.pathname}
            />
          ))}
        </div>
        <h1 className="text-lg font-bold px-4">Others</h1>
        <div className="flex flex-col gap-4 font-medium ">
          {otherLinks.map((link) => (
            <AdminNavLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              name={link.name}
              active={link.to === location.pathname}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SidebarAdmin;
