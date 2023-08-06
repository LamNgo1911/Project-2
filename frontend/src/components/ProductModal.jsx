import React, { useEffect, useRef, useState } from "react";
import {
  AiOutlineMinusCircle,
  AiFillPlusCircle,
  AiOutlineClose,
} from "react-icons/ai";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
// swiper grid
import ImageCard from "../components/ImageCard";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, setOpenProductModal } from "../redux/service/shoppingSlice";

function ProductModal({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [review, setReview] = useState(false);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [sizeError, setSizeError] = useState("");
  const [shakeAnimation, setShakeAnimation] = useState(false);
  const [amount, setAmount] = useState(1);
  const errorRef = useRef();

  const { user } = useSelector((state) => state.auth);

  // handle scroll up to the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.keyCode === 27) {
        dispatch(setOpenProductModal(false));
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);
  // --------------handle active--------------
  useEffect(() => {
    const firstColor = product?.colors[0]?.color;
    setColor(firstColor);
  }, [product]);

  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [activeSizeIndex, setActiveSizeIndex] = useState("");
  // --------------handle amount--------------
  const handleDecrement = () => {
    setAmount((pre) => {
      return pre === 1 ? pre : pre - 1;
    });
  };
  const handleIncrement = () => {
    setAmount((pre) => {
      return pre + 1;
    });
  };
  // --------------handle AddTocart--------------
  const handleAddToCart = () => {
    setSizeError(""); // Reset the size error message

    if (!size) {
      setSizeError("Please choose a size!");
      setShakeAnimation(true);

      setTimeout(() => {
        setShakeAnimation(false); // Reset shakeAnimation after a brief delay
      }, 500); // Adjust the delay duration as needed
    } else {
      setSizeError("");
      dispatch(
        addToCart({
          color,
          size,
          id: product?.id,
          image: product?.colors?.[activeColorIndex]?.images[0],
          price: product?.newPrice,
          name: product?.name,
          amount,
          category: product?.category?.name,
          userId: user?.id,
        })
      );
    }
  };

  return (
    <div className="relative flex flex-col justify-start gap-4 pb-8 p-8 bg-bg-primary w-[80%] h-[80vh] overflow-y-scroll">
      <div className="grid md:grid-cols-2 md:gap-16 gap-8">
        {/* images and review */}
        <div className="flex flex-col gap-8">
          {/* images */}
          <ImageCard product={product} color={color} colors={product?.colors} />
        </div>
        {/* details */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 border-b pb-8">
            <h1 className="font-semibold text-lg md:text-xl">
              {product?.name}
            </h1>
            <p className="text-xs md:text-sm">{product?.description}</p>
            <h1 className="font-bold text-xl md:text-2xl">
              ${product?.newPrice}
            </h1>
          </div>

          {product?.colors?.length > 1 && (
            <div className="flex flex-col gap-4 border-b pb-8">
              <p className="text-sm md:text-base font-bold">
                Color: <span className="font-normal">{color}</span>
              </p>
              <div className="flex gap-2">
                {product?.colors?.map(({ color, images }, index) => {
                  const isActive = index === activeColorIndex;
                  return (
                    <div
                      key={index}
                      className={`hover:border-black hover:border-2 rounded-full border-2 ${
                        isActive ? "active-border" : ""
                      }`}
                    >
                      <p
                        onClick={() => {
                          setColor(color);
                          setActiveColorIndex(index);
                        }}
                        className={`w-10 h-10 md:w-12 md:h-12 border rounded-full cursor-pointer bg-${color
                          ?.split(" ")
                          ?.join("-")}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 border-b pb-8">
            <div className="flex gap-8">
              <p className="text-sm md:text-base font-bold ">Choose a size</p>
              <div
                ref={errorRef}
                className="flex flex-row gap-2 text-red-500 text-sm items-center justify-start"
                aria-live="assertive"
              >
                <p>{sizeError}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full">
              {product?.sizes?.map((size, index) => {
                const isActive = index === activeSizeIndex;
                return (
                  <div
                    className={` ${
                      isActive ? "active-border" : ""
                    } hover:border-black hover:border-2 rounded-full border-2 flex justify-center items-center`}
                  >
                    <p
                      key={index}
                      onClick={() => {
                        setSize(size);
                        setActiveSizeIndex(index);
                      }}
                      className={`flex justify-center border items-center rounded-full
                    py-2 px-4 w-14 h-10 md:text-sm text-xs cursor-pointer hover:border-black ${
                      shakeAnimation ? "animate-shake" : ""
                    }`}
                    >
                      {size.toUpperCase()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-8 border-b pb-8">
            <div className="flex gap-8">
              <div className="flex gap-4 items-center text-bg-btn">
                <AiOutlineMinusCircle
                  onClick={handleDecrement}
                  className="cursor-pointer"
                />
                <p>{amount}</p>
                <AiFillPlusCircle
                  onClick={handleIncrement}
                  className="cursor-pointer"
                />
              </div>
              <div className="flex flex-col gap-1 items-start">
                <p className="text-xs md:text-sm">Only 12 Items Left!</p>
                <p className="text-xs md:text-sm">Don't miss it</p>
              </div>
            </div>
            <div className="flex gap-4 justify-between">
              <button
                onClick={handleAddToCart}
                className="border w-full rounded-full px-4 py-2 
                md:text-base text-sm bg-bg-btn cursor-pointer text-text-btn"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* close  */}
      <div
        className="absolute right-2 top-2 cursor-pointer"
        onClick={() => dispatch(setOpenProductModal(false))}
      >
        <AiOutlineClose className="text-xl md:text-2xl" />
      </div>
    </div>
  );
}

export default ProductModal;
