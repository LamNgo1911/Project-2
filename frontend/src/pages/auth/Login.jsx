import React, { useEffect, useRef, useState } from "react";
import image from "../../assets/symbol.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../axiosApi/axios";
import { AiFillExclamationCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { getUser } from "../../redux/service/authSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //   info
  const userRef = useRef();
  const errorRef = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  // error
  const [error, setError] = useState();
  // handle functions
  useEffect(() => {
    userRef?.current?.focus();
  }, []);
  // handle function
  const handle = async (e, loginData) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      const { data } = await axios.post(
        "/auth/login",
        JSON.stringify(loginData),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (data) {
        console.log(data);
        setLoading(false);
        setEmail("");
        setPassword("");
        dispatch(getUser(data?.user));
        navigate("/");
        window.location.reload(); // Refresh the page
      }
    } catch (error) {
      if (!error.response) {
        setError("No server response. Please try again later.");
      } else if (error.response.status === 400) {
        setError("Invalid credentials");
      } else if (error.response.status === 401) {
        setError("Unauthorized");
      } else if (error.response.status === 403) {
        setError("User account is already disabled.");
      } else {
        setError("Something went wrong. Please try again later");
      }

      errorRef?.current?.focus();
      setLoading(false);
    }
  };
  // handleLogin
  const handleLogin = (e) => {
    e.preventDefault();
    handle(e, {
      email,
      password,
    });
  };

  // handleDemoAdmin
  const handleDemoAdmin = (e) => {
    e.preventDefault();
    handle(e, {
      email: "lamngo123@gmail.com",
      password: "lamngo0961014196",
    });
  };
  // handleDemoUser
  const handleDemoUser = async (e) => {
    e.preventDefault();
    handle(e, {
      email: "lamngoforest@gmail.com",
      password: "lamngo123",
    });
  };
  return (
    <div className="flex justify-center items-center h-screen py-8">
      <div
        className="flex flex-col gap-4 items-center md:w-[40%] w-[80%] h-full justify-center 
        px-8 rounded-lg bg-gradient-to-b from-[#dfd3b8] to-[#e5e5e5]"
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
        <h1 className="text-base md:text-lg font-bold">Sign In</h1>
        <p className="text-xs md:text-sm  text-center">
          Use your email to continue with social to create an account
        </p>
        <form className="flex flex-col gap-4 w-[80%]">
          <div className="flex flex-col">
            <label
              className="text-xs md:text-sm font-bold"
              htmlFor="email"
              placeholder="name@gmail.com"
            >
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target?.value)}
              value={email}
              ref={userRef}
              type="email"
              name="email"
              id="email"
              className="border-[1.2px] outline-none rounded-lg p-2 shadow-inner"
              aria-label="Email"
            />
          </div>
          <div className="flex flex-col">
            <label
              className="text-xs md:text-sm font-bold"
              htmlFor="password"
              placeholder="At least 8 characters"
            >
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target?.value)}
              value={password}
              type="password"
              name="password"
              id="password"
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
          <Link
            to="/forgot-password"
            className="font-bold text-[10px] md:text-xs"
          >
            Forgot password?
          </Link>
          <button
            onClick={handleLogin}
            type="submit"
            className="py-2 px-4 self-center rounded-full 
            bg-bg-btn text-text-btn text-sm md:text-base font-semibold"
          >
            Sign In
          </button>
          <div className="flex flex-col gap-4">
            <button
              onClick={handleDemoAdmin}
              type="submit"
              className="py-2 px-4 self-center rounded-full 
            bg-[#477d95] hover:bg-[#294956] text-text-btn text-sm md:text-base font-semibold"
            >
              Demo admin
            </button>
            <button
              onClick={handleDemoUser}
              type="submit"
              className="py-2 px-4 self-center rounded-full 
            bg-[#477d95] hover:bg-[#294956] text-text-btn text-sm md:text-base font-semibold"
            >
              Demo user
            </button>
          </div>
        </form>
        <p className="text-xs md:text-sm">
          Don't have an account?
          <Link to="/register" className="font-bold">
            {" "}
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
