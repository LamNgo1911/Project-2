import React, { useEffect, useRef, useState } from "react";
import image from "../assets/symbol.png";
import { IoReorderThreeOutline, IoCloseOutline } from "react-icons/io5";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { BsPerson } from "react-icons/bs";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";
import { BsFillBagFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import axios from "../axiosApi/axios";

import {
  useGetAllCategoriesQuery,
  useGetAllProductsPerPageQuery,
} from "../redux/api/backendApi";
import SibarCategoryCard from "./SibarCategoryCard";
import { setSearchRedux } from "../redux/service/infoSlice";

function Sibar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { favoriteItems, cartItems } = useSelector((state) => state.shopping);
  const { user } = useSelector((state) => state.auth);
  // interface
  const [open, setOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [showLeftNav, setShowLeftNav] = useState(true);
  // search
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef();
  const inputRef = useRef();
  const [search, setSearch] = useState("");

  const { data, isFetching, isError } = useGetAllCategoriesQuery();
  const { data: productsData } = useGetAllProductsPerPageQuery({ search });

  // handle logout
  const handleLogout = async () => {
    try {
      const response = await axios.get("/auth/logout", {
        withCredentials: true,
      });
      if (response) {
        // console.log(response);
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/login");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleClose = () => {
    setOpen(!open);
  };
  const handleCategory = () => {
    setOpenCategory(!openCategory);
  };

  useEffect(() => {
    const handleScroll = () => {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 70) {
          setScroll(true);
        } else {
          setScroll(false);
        }
      });
    };
    handleScroll();
   return () => window.removeEventListener("scroll", handleScroll)
  }, []);
  // handle show and close the suggestion box
  useEffect(() => {
    const handleFocusWithin = (event) => {
      if (event.target.classList.contains("search-input")) {
        setShowLeftNav(false);
        setShowSuggestions(true);
      } else {
        setShowLeftNav(true);
        setShowSuggestions(false);
      }
    };

    document.addEventListener("focusin", handleFocusWithin);
    document.addEventListener("click", handleFocusWithin);

    return () => {
      document.removeEventListener("focusin", handleFocusWithin);
      document.removeEventListener("click", handleFocusWithin);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search) {
      dispatch(setSearchRedux(search));
      navigate(`/search/${search}`);
    }
  };

  return (
    // sibar
    <div
      className={`nav w-full max-w-[1280px] h-[70px] fixed top-0 z-[999] flex flex-row justify-between items-center 
    px-8 py-4 text-base md:text-lg ${
      scroll ? "bg-bg-primary border-b border-bg-primary" : "bg-transparent"
    }`}
    >
      {/* symbol */}
      <div className="flex flex-row justify-between items-center">
        <Link to="/" className="flex flex-row gap-2 items-center">
          <img
            src={image}
            alt="logo"
            className="md:w-10 md:h-10 w-8 h-8 rounded-full"
          />
          <h1 className="symbol-font">WearMeOut</h1>
        </Link>
      </div>
      {/* nav web */}
      <div
        className={`hidden flex-row gap-4 items-center ${
          showLeftNav && !search && "lg:flex"
        }`}
      >
        <div className="group/category">
          <Link
            to="/category/all"
            className="flex flex-row items-center py-2 group-hover/category:border-b-[3px] group-hover/category:border-bg-btn group-hover/category:pb-[5px]"
          >
            <h1 className="font-medium text-sm md:text-base">Category</h1>
            <MdKeyboardArrowDown className="text-2xl" />
          </Link>

          <div
            className={`absolute z-[999] left-0 w-full border rounded-lg px-8 py-8 
                bg-bg-primary invisible group-focus/category:visible group-hover/category:visible`}
          >
            <div className="grid grid-cols-3 gap-4">
              {data?.categories?.map((category) => (
                <Link
                  key={category?.name}
                  to={`/category/${category?.name.toLowerCase()}`}
                >
                  <SibarCategoryCard category={category} />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <Link to="/deals" className="flex flex-row gap-2 items-center">
          <h1 className="font-medium text-sm md:text-base">Deals</h1>
        </Link>
        <Link to="/coupons" className="flex flex-row gap-2 items-center">
          <h1 className="font-medium text-sm md:text-base">Coupons</h1>
        </Link>
        <Link to="/contact" className="flex flex-row gap-2 items-center">
          <h1 className="font-medium text-sm md:text-base">Contact</h1>
        </Link>
      </div>
      {/* right nav */}
      {/* ------------------ search ------------------ */}
      <form
        onSubmit={handleSubmit}
        className={`hidden relative md:flex border rounded-full px-4 text-sm py-1 ${
          showLeftNav && !search ? "" : "md:w-[40%] lg:w-[50%]"
        }`}
      >
        <input
          ref={inputRef}
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Search Products"
          type="text"
          className={`w-full outline-none ${
            scroll ? "bg-bg-primary" : "bg-transparent"
          } search-input `}
          autoComplete="off"
        />
        <Link>
          <AiOutlineSearch
            className="text-xl ml-auto text-[#a9a9a9]"
            onClick={handleSubmit}
          />
        </Link>
        {/* suggestion */}
        <div
          ref={suggestionRef}
          className={`absolute w-full border left-0 top-10 bg-bg-primary rounded-lg ${
            showSuggestions && search && productsData?.products?.length > 0
              ? "block"
              : "hidden"
          }`}
        >
          <div className="flex flex-col gap-4 px-4 py-4 h-full">
            {productsData?.products?.map((product) => {
              return (
                <Link
                  key={product?._id}
                  to={`/category/${product?.category?.name.toLowerCase()}/${
                    product?._id
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {product?.name}
                </Link>
              );
            })}
          </div>
        </div>
      </form>
      {/* ------------------ profile and shopping ------------------ */}
      <div className="flex items-center gap-4">
        <div className="group/person">
          <Link
            to={user?.name ? "/profile" : "/login"}
            className="hidden md:flex flex-row gap-1 py-2 items-center 
                group-hover/person:border-b-[3px] group-hover/person:border-bg-btn group-hover/person:pb-[5px]"
          >
            <BsPerson className="text-lg md:text-2xl" />
            <h1 className="font-medium text-sm md:text-base"></h1>
          </Link>

          {/* hover person */}
          <div
            className="absolute z-[999] border rounded-lg px-8 py-8 text-xs md:text-sm 
                    bg-bg-primary flex flex-col gap-4 invisible group-focus/person:visible group-hover/person:visible"
          >
            {user?.name ? (
              <Link className="cursor-pointer font-bold" to={"/profile"}>
                {user?.name}
              </Link>
            ) : (
              <Link to="/login">
                <p className="font-bold pb-4 border-b">Sign in / Register</p>
              </Link>
            )}
            {user?.role === "admin" && (
              <p
                className="cursor-pointer font-bold"
                onClick={() => navigate("/admin")}
              >
                Admin dashboard
              </p>
            )}
            <Link to="/orders">My orders</Link>
            <Link>My message</Link>
            <Link>Recently viewed</Link>
            {user?.name && (
              <p className="cursor-pointer font-bold" onClick={handleLogout}>
                Log out
              </p>
            )}
          </div>
        </div>
        <Link
          to="/favorite"
          className="hidden md:flex flex-row gap-1 items-center"
        >
          <AiOutlineHeart className="text-lg md:text-2xl" />
          <h1 className="font-medium text-sm md:text-base">
            {favoriteItems?.length || 0}
          </h1>
        </Link>
        <div className="group/bag">
          <Link
            to="/cart"
            className="hidden md:flex flex-row gap-1 items-center py-2
                group-hover/bag:border-b-[3px] group-hover/bag:border-bg-btn group-hover/bag:pb-[5px]"
          >
            <AiOutlineShoppingCart className="text-lg md:text-2xl" />
            <h1 className="font-medium text-sm md:text-base">
              {cartItems?.length || 0}
            </h1>
          </Link>

          {/* hover bag */}
          <div
            className="absolute z-[999] right-0 w-[20%] border rounded-lg px-8 py-8 text-xs md:text-sm 
                    bg-bg-primary flex flex-col items-center gap-4 invisible group-focus/bag:visible group-hover/bag:visible"
          >
            <BsFillBagFill className="text-2xl md:text-4xl" />
            <p>
              {cartItems?.length > 0
                ? `You have ${cartItems?.length || 0} in your cart`
                : "Shopping bag is empty"}
            </p>
          </div>
        </div>
      </div>
      {open ? (
        <IoCloseOutline className="text-3xl lg:hidden" onClick={handleClose} />
      ) : (
        <IoReorderThreeOutline
          className="text-3xl lg:hidden"
          onClick={handleClose}
        />
      )}
      {/* nav mobile */}
      <div
        className={`absolute z-[9999] lg:hidden w-full h-96 hide-scrollbar overflow-y-scroll top-20 left-0 flex-col gap-4 py-10
        border rounded-lg bg-bg-primary ${open ? "flex" : "hidden"}`}
      >
        <div className="flex flex-col gap-4 items-center">
          <div className="flex flex-col items-center gap-4 w-[80%] mx-auto">
            <Link className="flex flex-row items-center">
              <h1 className="font-medium text-sm md:text-base">Category</h1>
              {openCategory ? (
                <MdKeyboardArrowUp
                  className="text-2xl"
                  onClick={handleCategory}
                />
              ) : (
                <MdKeyboardArrowDown
                  className="text-2xl"
                  onClick={handleCategory}
                />
              )}
            </Link>
            <div
              className={`flex-col gap-4 px-8 py-8 border rounded-lg ${
                openCategory ? "flex" : "hidden"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data?.categories?.map((category, index) => (
                  <Link
                    key={index}
                    to={`/category/${category?.name.toLowerCase()}`}
                    onClick={() => setOpen(false)}
                  >
                    <SibarCategoryCard category={category} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link
            onClick={() => setOpen(false)}
            to="/deals"
            className="flex flex-row gap-2 items-center"
          >
            <h1 className="font-medium text-sm md:text-base">Deals</h1>
          </Link>
          <Link
            onClick={() => setOpen(false)}
            to="/coupons"
            className="flex flex-row gap-2 items-center"
          >
            <h1 className="font-medium text-sm md:text-base">Coupons</h1>
          </Link>
          <Link
            onClick={() => setOpen(false)}
            to="/contact"
            className="flex flex-row gap-2 items-center"
          >
            <h1 className="font-medium text-sm md:text-base">Contact</h1>
          </Link>
        </div>
      </div>

      <div className="fixed z-[100] md:hidden w-full bottom-0 left-0 py-4 px-8 border-t bg-bg-primary">
        <div className="flex justify-between w-full">
          <div className="group/person-mobile">
            <Link
              to={user?.name ? "/profile" : "/login"}
              className="flex flex-row gap-1 py-2 items-center border-b-[3px]  border-b-bg-primary pb-[5px] 
                group-hover/person-mobile:border-b-[3px] group-hover/person-mobile:border-bg-btn group-hover/person-mobile:pb-[5px]"
            >
              <BsPerson className="text-lg md:text-xl" />
              <h1 className="font-medium text-sm md:text-base">Account</h1>
            </Link>
            {/* hover person */}
            <div
              className="absolute bottom-12 z-[999] border rounded-lg px-8 py-8 text-xs md:text-sm 
                    bg-bg-primary flex flex-col gap-4 invisible group-focus/person-mobile:visible group-hover/person-mobile:visible"
            >
              {user?.name ? (
                <Link className="cursor-pointer font-bold" to={"/profile"}>
                  {user?.name}
                </Link>
              ) : (
                <Link to="/login">
                  <p className="font-bold pb-4 border-b">Sign in / Register</p>
                </Link>
              )}
              {user?.role === "admin" && (
                <p
                  className="cursor-pointer font-bold"
                  onClick={() => navigate("/admin")}
                >
                  Admin dashboard
                </p>
              )}
              <Link to="/orders">My orders</Link>
              <Link>My message</Link>
              <Link>Recently viewed</Link>
              {user?.name && (
                <p className="cursor-pointer font-bold" onClick={handleLogout}>
                  Log out
                </p>
              )}
            </div>
          </div>
          <Link to="/favorite" className="flex flex-row gap-2 items-center">
            <AiOutlineHeart className="text-lg md:text-xl" />
            <h1 className="font-medium text-sm md:text-base">
              {favoriteItems?.length || 0}
            </h1>
          </Link>
          <Link to="/cart" className="flex flex-row gap-2 items-center">
            <AiOutlineShoppingCart className="text-lg md:text-xl" />
            <h1 className="font-medium text-sm md:text-base">
              {cartItems?.length || 0}
            </h1>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Sibar;
