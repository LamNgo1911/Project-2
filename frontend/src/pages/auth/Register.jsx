import React, { useState, useRef, useEffect } from "react";
import image from "../../assets/symbol.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../axiosApi/axios";
import { AiFillExclamationCircle } from "react-icons/ai";

function Register() {
  const navigate = useNavigate();
  const userRef = useRef();
  const errorRef = useRef();

  //   regex
  const PWD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  const EMAIL_REGEX =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //   Error
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  //   Checking valid
  const [isValidName, setIsValidName] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isCreated, setIsCreated] = React.useState(false);

  // handle functions
  useEffect(() => {
    userRef?.current?.focus();
  }, []);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (!value) {
      setIsValidName(false);
      setNameError("Username is required");
    } else if (name?.length > 8) {
      setIsValidName(false);
      setNameError("Username can not be longer than 8 charaters");
    } else {
      setIsValidName(true);
      setNameError("");
      setError("");
    }
  };
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!value) {
      setIsValidEmail(false);
      setEmailError("Email is required");
    } else if (!EMAIL_REGEX.test(value)) {
      setIsValidEmail(false);
      setEmailError("Email is not valid");
    } else {
      setIsValidEmail(true);
      setEmailError("");
      setError("");
    }
  };
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    console.log(value);
    if (!value) {
      setIsValidPassword(false);
      setPasswordError("Password is required");
    } else if (password.length < 6) {
      setIsValidPassword(false);
      setPasswordError("Password must contain at least 8 characters");
    } else if (!PWD_REGEX.test(value)) {
      setIsValidPassword(false);
      setPasswordError(
        "Password must contain at least one letter and one number"
      );
    } else {
      setIsValidPassword(true);
      setPasswordError("");
      setError("");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const v1 = EMAIL_REGEX.test(email);
    const v2 = PWD_REGEX.test(password);

    if (!v1 || !v2) {
      setError("Invalid input");
      return;
    }

    if (isValidName && isValidEmail && isValidPassword) {
      try {
        const reponse = await axios.post(
          "/auth/register",
          JSON.stringify({
            name,
            email,
            password,
          }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        setIsCreated(true);
        console.log(reponse);
      } catch (error) {
        if (!error.response) {
          setError("No server response");
        } else if (error.response.status === 409) {
          setError("Username or email already exists");
        } else {
          setError("Something went wrong");
        }

        errorRef?.current?.focus();
      }
    }
  };

  return (
    <div className="flex h-screen justify-center items-center py-8">
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
        <h1 className="text-base md:text-lg font-bold">Get started</h1>
        <p className="text-xs md:text-sm text-center">
          Use your email to create an account
        </p>
        <form className="flex flex-col gap-4 w-[80%]">
          <div className="flex flex-col">
            <label className="text-xs md:text-sm font-bold" htmlFor="name">
              Name
            </label>
            {!isValidName && nameError && (
              <div
                ref={errorRef}
                className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
                aria-live="assertive"
              >
                <AiFillExclamationCircle />
                <p>{nameError}</p>
              </div>
            )}
            <input
              ref={userRef}
              onChange={handleNameChange}
              value={name}
              placeholder="First and last name"
              type="text"
              name="name"
              id="name"
              className="border-[1.2px] outline-none rounded-lg p-2 shadow-inner text-xs md:text-sm"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs md:text-sm font-bold" htmlFor="email">
              Email
            </label>
            {!isValidEmail && emailError && (
              <div
                ref={errorRef}
                className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
                aria-live="assertive"
              >
                <AiFillExclamationCircle />
                <p>{emailError}</p>
              </div>
            )}
            <input
              onChange={handleEmailChange}
              value={email}
              placeholder="name@gmail.com"
              type="email"
              name="email"
              id="email"
              className="border-[1.2px] outline-none rounded-lg p-2 shadow-inner text-xs md:text-sm"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs md:text-sm font-bold" htmlFor="password">
              Password
            </label>
            {!isValidPassword && passwordError && (
              <div
                ref={errorRef}
                className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
                aria-live="assertive"
              >
                <AiFillExclamationCircle />
                <p>{passwordError}</p>
              </div>
            )}
            <input
              onChange={handlePasswordChange}
              value={password}
              placeholder="At least 6 characters"
              type="password"
              name="password"
              id="password"
              className="border-[1.2px] outline-none rounded-lg p-2 shadow-inner text-xs md:text-sm"
            />
          </div>

          {error && (
            <div
              ref={errorRef}
              className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
              aria-live="assertive"
            >
              <AiFillExclamationCircle />
              <p>{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            type="submit"
            className="py-2 px-4 w-[60%] self-center rounded-full 
                 bg-bg-btn text-text-btn text-sm md:text-base font-semibold"
          >
            Register
          </button>
        </form>
      </div>
      {/* notification */}
      {isCreated && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div
            className="flex flex-col gap-4 items-center h-[80%] w-[80%] md:w-[40%] justify-end
                py-8 rounded-lg bg-notiImage bg-cover bg-[50%] px-8"
          >
            <h1 className="text-base md:text-lg font-bold">Account created</h1>
            <p className="text-xs md:text-sm text-center">
              Please check your email to verify your account
            </p>
            <button
              onClick={() => navigate("/login")}
              className="py-2 px-4 rounded-full
                    bg-bg-btn text-text-btn text-sm md:text-base"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
