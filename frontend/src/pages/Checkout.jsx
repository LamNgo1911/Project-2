import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setShippingInfo } from "../redux/service/shoppingSlice";
import { useDispatch } from "react-redux";

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const EMAIL_REGEX =
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [country, setCountry] = useState("");
  const [fullName, setFullName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postCode, setPostCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Error
  const [emailError, setEmailError] = useState("");
  const [confirmEmailError, setConfirmEmailError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [streetError, setStreetError] = useState("");
  const [cityError, setCityError] = useState("");
  const [postCodeError, setPostCodeError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [error, setError] = useState("");

  const userRef = useRef();
  const errorRef = useRef();

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  // checking Valid
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidConfirmEmail, setIsValidConfirmEmail] = useState(false);
  const [isValidCountry, setIsValidCountry] = useState(false);
  const [isValidFullName, setIsValidFullName] = useState(false);
  const [isValidStreet, setIsValidStreet] = useState(false);
  const [isValidCity, setIsValidCity] = useState(false);
  const [isValidPostCode, setIsValidPostCode] = useState(false);
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);
  // scroll to the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // handle value onchange
  const handleEmailchange = (e) => {
    const value = e.target.value?.toLowerCase();
    setEmail(value);

    if (!value) {
      setIsValidEmail(false);
      setEmailError("Please add an email");
      errorRef.current?.focus();
    } else if (!EMAIL_REGEX.test(value)) {
      setIsValidEmail(false);
      setEmailError("Invalid email");
      errorRef.current?.focus();
    } else {
      setEmailError("");
      setIsValidEmail(true);
    }
  };
  const handleConfirmEmailchange = (e) => {
    const value = e.target.value.toLowerCase();
    setConfirmEmail(value);

    if (value !== email) {
      setIsValidConfirmEmail(false);
      setConfirmEmailError("Emails do not match");
      errorRef.current?.focus();
    } else {
      setConfirmEmailError("");
      setIsValidConfirmEmail(true);
    }
  };
  const handleCountrychange = (e) => {
    const value = e.target.value;
    setCountry(value);

    if (!value) {
      setIsValidCountry(false);
      setCountryError("Please choose a country");
      errorRef.current?.focus();
    } else {
      setCountryError("");
      setIsValidCountry(true);
    }
  };
  const handleFullNamechange = (e) => {
    const value = e.target.value;
    setFullName(value);
    if (!value) {
      setIsValidFullName(false);
      setFullNameError("Please add your name");
      errorRef.current?.focus();
    } else if (fullName?.length > 8) {
      setIsValidFullName(false);
      setFullNameError("Username can not be longer than 8 charaters");
      errorRef.current?.focus();
    } else {
      setFullNameError("");
      setIsValidFullName(true);
    }
  };
  const handleStreetchange = (e) => {
    const value = e.target.value;
    setStreet(value);

    if (!value) {
      setIsValidStreet(false);
      setStreetError("Please add a street");
      errorRef.current?.focus();
    } else {
      setStreetError("");
      setIsValidStreet(true);
    }
  };
  const handleCitychange = (e) => {
    const value = e.target.value;
    setCity(value);

    if (!value) {
      setIsValidCity(false);
      setCityError("Please choose a country");
      errorRef.current?.focus();
    } else {
      setCityError("");
      setIsValidCity(true);
    }
  };
  const handlePostCodechange = (e) => {
    const value = e.target.value;
    setPostCode(value);

    if (!value) {
      setIsValidPostCode(false);
      setPostCodeError("Please choose a country");
      errorRef.current?.focus();
    } else {
      setPostCodeError("");
      setIsValidPostCode(true);
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);

    if (!value) {
      setIsValidPhoneNumber(false);
      setPhoneNumberError("Please choose a country");
      errorRef.current?.focus();
    } else {
      setPhoneNumberError("");
      setIsValidPhoneNumber(true);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (
      isValidEmail &&
      isValidConfirmEmail &&
      isValidCountry &&
      isValidCity &&
      isValidFullName &&
      isValidPostCode &&
      isValidStreet
    ) {
      const shippingInfo = {
        name: fullName,
        email,
        phoneNumber,
        StreetAddress: street,
        city,
        postCode,
        country,
      };
      dispatch(setShippingInfo(shippingInfo));
      navigate("/payment");
    } else {
      console.log("hello");
      setError("Please fill all required fields");
      errorRef.current?.focus();
    }
  };

  return (
    <form
      onSubmit={handleClick}
      className="flex flex-col justify-start items-center gap-8 pb-8 px-8 mt-8 "
    >
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="flex">
          <div className="flex items-center">
            <div className="md:w-8 md:h-8 w-6 h-6 rounded-full border bg-bg-btn" />
            <div className="h-2 border md:w-36 w-24 bg-gray-300" />
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full border bg-gray-300" />
            <div className="h-2 border md:w-36 w-24 bg-gray-300" />
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full border bg-gray-300" />
          </div>
        </div>
        <div className="flex justify-between md:gap-24 gap-14">
          <h1 className="text-sm md:text-base ">Shipping</h1>
          <h1 className="text-sm md:text-base ">payment</h1>
          <h1 className="text-sm md:text-base ">review</h1>
        </div>
      </div>
      <h1 className="text-2xl md:text-4xl font-bold">Shipping address</h1>
      <div className="flex flex-col gap-4 md:w-[60%] w-full">
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-base md:text-lg">
            Email <span className="text-red-500">*</span>
          </label>
          {!isValidEmail && (
            <div
              ref={errorRef}
              className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
              aria-live="assertive"
            >
              <p>{emailError}</p>
            </div>
          )}
          <input
            ref={userRef}
            value={email}
            onChange={handleEmailchange}
            type="email"
            name="email"
            id="email"
            className="border-[1.2px] outline-none rounded-lg p-3 shadow-inner"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-base md:text-lg" htmlFor="confirm-email">
            Confirm email <span className="text-red-500">*</span>
          </label>
          {!isValidConfirmEmail && (
            <div
              ref={errorRef}
              className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
              aria-live="assertive"
            >
              <p>{confirmEmailError}</p>
            </div>
          )}
          <input
            value={confirmEmail}
            onChange={handleConfirmEmailchange}
            className="border-[1.2px] outline-none rounded-lg p-3 shadow-inner"
            type="email"
            name="confirm-email"
            id="confirm-email"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-base md:text-lg" htmlFor="country">
            Country <span className="text-red-500">*</span>
          </label>
          {!isValidCountry && (
            <div
              ref={errorRef}
              className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
              aria-live="assertive"
            >
              <p>{countryError}</p>
            </div>
          )}
          <select
            value={country}
            onChange={handleCountrychange}
            className="border-[1.2px] outline-none rounded-lg p-3 shadow-inner"
            name="country"
            id="country"
          >
            <option value="Vietnam">Vietnam</option>
            <option value="USA">USA</option>
            <option value="Finland">Finland</option>
            <option value="Sweden">Sweden</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-base md:text-lg" htmlFor="name">
            Full name <span className="text-red-500">*</span>
          </label>
          {!isValidFullName && (
            <div
              ref={errorRef}
              className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
              aria-live="assertive"
            >
              <p>{fullNameError}</p>
            </div>
          )}
          <input
            value={fullName}
            onChange={handleFullNamechange}
            className="border-[1.2px] outline-none rounded-lg p-3 shadow-inner"
            type="text"
            name="name"
            id="name"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-base md:text-lg" htmlFor="address">
            Street address <span className="text-red-500">*</span>
          </label>
          {!isValidEmail && (
            <div
              ref={errorRef}
              className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
              aria-live="assertive"
            >
              <p>{streetError}</p>
            </div>
          )}
          <input
            value={street}
            onChange={handleStreetchange}
            className="border-[1.2px] outline-none rounded-lg p-3 shadow-inner"
            type="text"
            name="address"
            id="address"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-base md:text-lg" htmlFor="city">
            City <span className="text-red-500">*</span>
          </label>
          {!isValidCity && (
            <div
              ref={errorRef}
              className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
              aria-live="assertive"
            >
              <p>{cityError}</p>
            </div>
          )}
          <input
            value={city}
            onChange={handleCitychange}
            className="border-[1.2px] outline-none rounded-lg p-3 shadow-inner"
            type="text"
            name="city"
            id="city"
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1 w-full">
            <label className="text-base md:text-lg" htmlFor="postal-code">
              Postal code <span className="text-red-500">*</span>
            </label>
            {!isValidPostCode && (
              <div
                ref={errorRef}
                className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
                aria-live="assertive"
              >
                <p>{postCodeError}</p>
              </div>
            )}
            <input
              value={postCode}
              onChange={handlePostCodechange}
              className="border-[1.2px] w-full outline-none rounded-lg p-3 shadow-inner"
              type="text"
              name="postal-code"
              id="postal-code"
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1 w-full">
            <label className="text-base md:text-lg" htmlFor="phone-number">
              Phone Number <span className="text-red-500">*</span>
            </label>
            {!isValidPhoneNumber && (
              <div
                ref={errorRef}
                className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
                aria-live="assertive"
              >
                <p>{phoneNumberError}</p>
              </div>
            )}
            <input
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              className="border-[1.2px] w-full outline-none rounded-lg p-3 shadow-inner"
              type="text"
              name="phone-number"
              id="phone-number"
            />
          </div>
        </div>
        {error && (
          <div
            ref={errorRef}
            className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
            aria-live="assertive"
          >
            <p>{error}</p>
          </div>
        )}
      </div>
      <button
        onSubmit={handleClick}
        type="submit"
        className="md:w-[60%] w-full py-2 px-4 rounded-full 
        border bg-bg-btn text-text-btn"
      >
        Continue to payment
      </button>
    </form>
  );
}

export default Checkout;
