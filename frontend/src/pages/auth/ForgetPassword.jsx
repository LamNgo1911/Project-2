import React, { useEffect, useRef, useState } from "react";
import image from "../../assets/symbol.png"
import { Link } from "react-router-dom";
import axios from "../../axiosApi/axios";
import { AiFillExclamationCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { getEmail } from "../../redux/service/authSlice";

function ForgetPassword() {
  const [showNoti, setShowNoti] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const userRef = useRef();
  const errorRef = useRef();

  const dispatch = useDispatch();

  useEffect(() => {
    userRef?.current?.focus();
  }, []);

  const handleClick = async (e) => {
    e.preventDefault();

    if (email) {
      console.log(email);
      try {
        const response = await axios.post(
          "/auth/forgot-password",
          JSON.stringify({ email }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        if (response) {
          dispatch(getEmail(email));
          setEmail("");
          setError("");
          setShowNoti(true);
        }
      } catch (error) {
        if (!error.response) {
          setError("No server response. Please try again later.");
        } else if (error.response.status === 400) {
          setError("Invalid email");
        } else if (error.response.status === 401) {
          setError("Unauthorized");
        } else {
          setError("Failed to send OTP");
        }
        errorRef?.current?.focus();
      }
    } else {
      setError("Please add your email");
      errorRef?.current?.focus();
    }
  };
  return (
    <div className="flex justify-center items-center h-screen py-8">
      <div
        className="flex flex-col gap-4 items-center md:w-[40%] w-[80%] h-full justify-center 
        py-8 px-8 rounded-lg bg-gradient-to-b from-[#dfd3b8] to-[#e5e5e5]"
      >
        <div className="flex flex-row justify-between items-center pb-4">
          <Link to="/" className="flex flex-row gap-2 items-center">
            <img
              src={image}
              alt="logo"
              className="md:w-10 md:h-10 w-8 h-8 border rounded-full"
            />
            <h1 className="symbol-font">WearMeOut</h1>
          </Link>
        </div>
        <h1 className="text-base md:text-lg font-bold">Forget Password</h1>
        <p className="text-xs md:text-sm  text-center">
          We need your email address so we can send you the password reset code
        </p>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-xs md:text-sm font-bold" htmlFor="email">
              Email
            </label>
            <input
              ref={userRef}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="text"
              name="email"
              id="email"
              className="border-[1.2px] outline-none rounded-lg p-2 shadow-inner"
            />
          </div>

          {error && (
            <div
              ref={errorRef}
              className="flex flex-row gap-2 text-red-500 text-xs md:text-sm items-center justify-start"
              aria-live="assertive"
            >
              <AiFillExclamationCircle />
              <p>{error}</p>
            </div>
          )}

          <button
            onClick={handleClick}
            type="submit"
            className="py-2 px-4 rounded-full 
                 bg-bg-btn text-text-btn text-xs md:text-sm font-semibold"
          >
            Send Verification Code
          </button>
        </form>
      </div>

      {/* notification */}
      <div
        className={`fixed top-0 left-0 w-full h-full justify-center items-center bg-black bg-opacity-50 ${
          showNoti ? "flex" : "hidden"
        }`}
      >
        <div
          className="flex flex-col gap-4 items-center h-[80%] w-[80%] md:w-[40%] justify-end
                py-8 rounded-lg bg-notiImage bg-cover bg-[50%] px-8"
        >
          <h1 className="md:text-xl text-lg font-bold">
            Verification Code Sent
          </h1>
          <p className="text-center text-sm md:text-base">
            We have sent you a verification code to your email address
          </p>
          <Link
            to="/verify-email"
            className="py-2 px-4 rounded-full
                    bg-bg-btn text-text-btn text-xs md:text-sm"
          >
            OK
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
