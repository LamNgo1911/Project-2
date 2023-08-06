import React, { useEffect, useState } from "react";
import { AiOutlineHome, AiOutlineSearch } from "react-icons/ai";
import { IoReorderThreeOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import image from "../../assets/symbol.png";
import { BiCategory, BiLogOut } from "react-icons/bi";
import { BsBox, BsCart } from "react-icons/bs";
import { RxPerson } from "react-icons/rx";
import { RiCouponLine } from "react-icons/ri";
import { GrContact } from "react-icons/gr";
import { FiSettings } from "react-icons/fi";
import { BsFillCalendarFill } from "react-icons/bs"; // Correct import
import { useDispatch } from "react-redux";
import { setSearchAdmin } from "../../redux/service/infoSlice";
import axios from "../../axiosApi/axios";
import { getUser } from "../../redux/service/authSlice";

const AdminNavLink = ({ icon, name, to, active, setOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // handle logout
  const handleClick = async () => {
    setOpen(false);
    if (name === "Logout") {
      try {
        const response = await axios.get("/auth/logout", {
          withCredentials: true,
        });
        if (response) {
          // console.log(response);
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

function Searchbar() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Define an array of link items
  const links = [
    {
      to: "/admin",
      name: "Dashboard",
      icon: <AiOutlineHome className="text-xl" />,
    },
    {
      to: "/admin/categories",
      name: "Categories",
      icon: <BiCategory className="text-xl" />,
    },
    {
      to: "/admin/products",
      name: "Products",
      icon: <BsBox className="text-xl" />,
    },
    {
      to: "/admin/orders",
      name: "Orders",
      icon: <BsCart className="text-xl" />,
    },
    {
      to: "/admin/users",
      name: "Users",
      icon: <RxPerson className="text-xl" />,
    },
    {
      to: "/admin/coupons",
      name: "Coupons",
      icon: <BsFillCalendarFill className="text-xl" />,
    },
    {
      to: "/admin/deals",
      name: "Deals",
      icon: <RiCouponLine className="text-xl" />,
    },
    {
      to: "/admin/contact",
      name: "Contact",
      icon: <GrContact className="text-xl" />,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search) {
      dispatch(setSearchAdmin(search));
      navigate(`/admin/search/${search}`);
    }
  };

  // Function to close the sidebar when clicking outside of it
  const handleCloseSidebar = (e) => {
    if (e.target.classList.contains("navbar")) {
      setOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleCloseSidebar);
    return () => {
      window.removeEventListener("click", handleCloseSidebar);
    };
  }, []);

  return (
    <div className="fixed md:static z-[9999] top-0 left-0 flex justify-between items-center gap-8 h-[10vh] w-full px-8 border-b bg-[#fff]">
      <IoReorderThreeOutline
        className="text-2xl md:hidden"
        onClick={() => setOpen(true)}
      />
      <form
        onSubmit={handleSubmit}
        className="relative flex border-[1.2px] rounded-lg p-2 shadow-inner md:text-sm text-xs w-[60%]"
      >
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Search Products"
          type="text"
          className="w-full outline-none bg-[#fff] "
          autoComplete="off"
        />
        <Link>
          <AiOutlineSearch
            className="text-xl ml-auto text-[#a9a9a9]"
            onClick={handleSubmit}
          />
        </Link>
      </form>
      {/* profile */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src="https://wallpapers.com/images/hd/cool-profile-picture-ld8f4n1qemczkrig.jpg"
            alt=""
            className="w-8 h-8 rounded-full border object-cover"
          />
          <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
      </div>
      {/* left bar */}
      <div
        className={`fixed navbar z-[9999] left-0 top-0 w-full bg-black bg-opacity-50 ${
          open ? "flex" : "hidden"
        }`}
      >
        <div
          className={`md:hidden flex-col gap-4 w-[80%] h-screen border-r bg-bg-primary`}
        >
          {/* symbol */}
          <div className="flex justify-between items-center h-[10vh] px-8">
            <Link
              to="/"
              className="flex flex-row gap-2 items-center"
              onClick={() => setOpen(false)}
            >
              <img src={image} alt="logo" className="w-8 h-8 rounded-full" />
              <h1 className="symbol-font">WearMeOut</h1>
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-lg font-bold px-8">Menu</h1>
            <div className="flex flex-col gap-4 font-medium">
              {/* Use map to dynamically render the links */}
              {links.map((link) => (
                <AdminNavLink
                  key={link.to}
                  to={link.to}
                  icon={link.icon}
                  name={link.name}
                  active={link.to === location.pathname}
                  setOpen={setOpen}
                />
              ))}
            </div>
            <h1 className="text-lg font-bold px-8">Others</h1>
            <div className="flex flex-col gap-4 font-medium">
              {otherLinks.map((link) => (
                <AdminNavLink
                  key={link.to}
                  to={link.to}
                  icon={link.icon}
                  name={link.name}
                  active={link.to === location.pathname}
                  setOpen={setOpen}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Searchbar;
