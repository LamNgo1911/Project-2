import React, { useEffect, useRef, useState } from "react";
import image from "../../assets/symbol.png";
import { Link } from "react-router-dom";
import axios from "../../axiosApi/axios";
import { AiFillExclamationCircle } from "react-icons/ai";

function VerifyEmail() {
  const [isCode, setIsCode] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const errorRef = useRef();

  // reset otp
  useEffect(() => {
    let timer = null;

    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
    }

    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResendOTP = async () => {
    try {
      const response = await axios.post(
        "/auth/forgot-password",
        JSON.stringify({ email }),
        {
          headers: { "Content-Type": "application/json", },
          withCredentials: true,
        }
      );
      if (response) {
        setCountdown(60);
        setResendDisabled(true);
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
  };
  // handle auto focus input
  useEffect(() => {
    inputRefs?.current[0]?.focus();
  }, []);

  const handleOtpChange = (index, e) => {
    const value = e.target.value;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    if (value === "") {
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    } else {
      if (index < otpValues.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Verify OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otpValues.join("");
    if (otpValues.length === 4) {
      console.log("otpString: ", otpString);
      try {
        const response = await axios.post(
          "/auth/verify-otp",
          JSON.stringify({ otp: otpString }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        if (response) {
          setError("");
          setIsCode(true);
        }
      } catch (error) {
        if (!error.response) {
          setError("No server response. Please try again later.");
        } else if (error.response.status === 400) {
          setError("OTP has expired");
        } else {
          setError("Something went wrong. Please try again later.");
        }
        errorRef?.current?.focus();
      }
    } else {
      console.log(otpValues);
      setError("Please enter 4-digits code");
      errorRef?.current?.focus();
    }
  };

  return (
    <div className="flex h-screen justify-center items-center py-8">
      <div
        className="flex flex-col gap-4 items-center justify-center md:w-[40%] w-[80%] h-full 
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
        <p className="text-xs md:text-sm text-center">
          You need to enter 4-digit code we send to your email address
        </p>
        <form className="flex flex-col gap-4">
          <div className="flex justify-between gap-4 self-center">
            {Array(4)
              .fill()
              .map((_, index) => {
                return (
                  <input
                    key={index}
                    ref={(ref) => {
                      if (inputRefs.current) {
                        console.log(ref);
                        inputRefs.current[index] = ref;
                      }
                    }}
                    onChange={(e) => handleOtpChange(index, e)}
                    type="text"
                    maxLength={1}
                    className="md:w-12 md:h-12 w-10 h-10 border text-center rounded-lg bg-bg-primary p-3"
                  />
                );
              })}
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
            onClick={handleVerify}
            type="submit"
            className="py-2 px-4 rounded-full 
                 bg-bg-btn text-text-btn text-xs md:text-sm text-center font-semibold"
          >
            Confirm
          </button>
          {/* did not receive */}
          <div className="flex flex-col gap-2">
            <p className="text-xs md:text-sm text-center">
              Did not receive the code?
            </p>
            <p
              onClick={handleResendOTP}
              className={`text-xs md:text-sm text-center font-bold ${
                resendDisabled ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              Resend
            </p>
            <p className="text-xs md:text-sm text-center">{countdown}</p>
          </div>
        </form>

        {/* successful verify code to reset password notification */}
        <div
          className={`fixed top-0 left-0 w-full h-full justify-center 
            items-center bg-black bg-opacity-50 ${isCode ? "flex" : "hidden"}`}
        >
          <div
            className="flex flex-col gap-4 items-center h-[80%] w-[80%] md:w-[40%] justify-end
                py-8 rounded-lg bg-notiImage bg-cover bg-[50%] px-8"
          >
            <p className="text-xs md:text-sm text-center">
              Your code is verified
            </p>
            <Link
              to="/reset-password"
              className="py-2 px-4 rounded-full
                    bg-bg-btn text-text-btn text-xs md:text-sm"
            >
              Reset Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
