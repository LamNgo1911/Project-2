import React, { useRef, useState } from "react";
import image from "../../assets/symbol.png";
import { Link } from "react-router-dom";
import axios from "../../axiosApi/axios";
import { AiFillExclamationCircle } from "react-icons/ai";
import { useSelector } from "react-redux";

function ResetPassword() {
  const [isCreated, setIsCreated] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { email } = useSelector((state) => state.auth);
  const errorRef = useRef();

  //   regex
  const PWD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (!value) {
      setErrorPassword("Password is required");
    } else if (password.length < 6) {
      setErrorPassword("Password must contain at least 8 characters");
    } else if (!PWD_REGEX.test(value)) {
      setErrorPassword(
        "Password must contain at least one letter and one number"
      );
    } else {
      setErrorPassword("");
    }
  };

  const handleRepeatPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (password !== value) {
      setErrorConfirmPassword("Passwords do not match.");
    } else {
      setErrorConfirmPassword("");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const v = PWD_REGEX.test(password);

    if (!v) {
      setError("Invalid input");
      return;
    }

    if (password && confirmPassword && password === confirmPassword) {
      try {
        const response = await axios.post(
          "/auth/reset-password",
          JSON.stringify({ email, password }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        if (response) {
          setError("");
          setIsCreated(true);
        }
      } catch (error) {
        if (!error.response) {
          setError("No server response. Please try again later.");
        } else if (error.response.status === 400) {
          setError("Invalid credentials");
        } else {
          setError("Something went wrong. Please try again later");
        }
      }
    } else if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
    } else if (password !== confirmPassword) {
      setError("Passwords do not match.");
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
        <h1 className="text-base md:text-lg font-bold">
          Create a New Password
        </h1>
        <p className="text-xs md:text-sm  text-center">
          You need to create a new password for your account
        </p>
        <form className="flex flex-col gap-4 w-[80%]">
          <div className="flex flex-col">
            <label
              className="text-xs md:text-sm font-bold"
              htmlFor="password"
              placeholder="At least 8 characters"
            >
              Password
            </label>
            {errorPassword && (
              <div
                ref={errorRef}
                className="flex flex-row gap-2 text-red-500 text-xs md:text-sm items-center justify-start"
                aria-live="assertive"
              >
                <AiFillExclamationCircle />
                <p>{errorPassword}</p>
              </div>
            )}
            <input
              onChange={handlePasswordChange}
              value={password}
              type="password"
              name="password"
              id="password"
              className="border-[1.2px] outline-none rounded-lg p-2 shadow-inner "
            />
          </div>

          <div className="flex flex-col ">
            <label
              className="text-xs md:text-sm font-bold"
              htmlFor="repeat-password"
              placeholder="At least 8 characters"
            >
              Repeat Password
            </label>
            {errorConfirmPassword && (
              <div
                ref={errorRef}
                className="flex flex-row gap-2 text-red-500 text-xs md:text-sm items-center justify-start"
                aria-live="assertive"
              >
                <AiFillExclamationCircle />
                <p>{errorConfirmPassword}</p>
              </div>
            )}
            <input
              onChange={handleRepeatPasswordChange}
              value={confirmPassword}
              type="password"
              name="repeat-password"
              id="repeat-password"
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
            onClick={handleCreate}
            type="submit"
            className="py-2 px-4 rounded-full 
                 bg-bg-btn text-text-btn text-xs md:text-sm font-semibold"
          >
            Create
          </button>
        </form>
      </div>

      {/* notification */}
      <div
        className={`fixed top-0 left-0 w-full h-full justify-center items-center bg-black bg-opacity-50 ${
          isCreated ? "flex" : "hidden"
        }`}
      >
        <div
          className="flex flex-col gap-4 items-center h-[80%] w-[80%] md:w-[40%] justify-end
                py-8 rounded-lg bg-notiImage bg-cover bg-[50%] px-8"
        >
          <h1 className="text-lg md:text-xl font-bold">Password Reset</h1>
          <p className="text-sm md:text-base text-center">
            Your password has been reset successfully
          </p>
          <Link
            to="/login"
            className="py-2 px-4 rounded-full
                    bg-bg-btn text-text-btn text-xs md:text-sm"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
