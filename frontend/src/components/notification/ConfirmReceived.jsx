import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setReceivedOrder } from "../../redux/service/shoppingSlice";
import axios from "../../axiosApi/axios";

function ConfirmReceived() {
  const { receivedOrder } = useSelector((state) => state.shopping);
  const dispatch = useDispatch();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    if (receivedOrder) {
      setNotificationMessage("Did you receive your order?");
      setShowNotification(true);
    }
  }, [receivedOrder]);

  const handleYesBtn = async () => {
    setShowNotification(false);

    try {
      const { data } = await axios.patch(
        `orders/${receivedOrder?._id}/updateOrderStatus`,
        JSON.stringify({
          status: "delivered",
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (data) {
        dispatch(setReceivedOrder(null));
        console.log(data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleNoBtn = () => {
    setShowNotification(false);
    dispatch(setReceivedOrder(null));
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.keyCode === 27) {
        setShowNotification(false);
        dispatch(setReceivedOrder(null));
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div
      className={`fixed bg-black z-[999] h-full w-full max-w-[1280px] bg-opacity-50 text-bg-nav justify-center items-center py-4 px-8 ${
        showNotification ? "flex" : "hidden"
      }`}
    >
      <div className="bg-[#51307e] text-bg-nav py-4 px-8 rounded-full flex flex-col gap-4">
        <p className="text-base md:text-xl font-semibold">
          {notificationMessage}
        </p>
        <div className="flex gap-8 justify-center items-center text-xs md:text-sm">
          <button
            onClick={handleYesBtn}
            className="`border rounded-full px-2 bg-[#d6d59b] text-black"
          >
            Yes
          </button>
          <button
            onClick={handleNoBtn}
            className="`border rounded-full px-2 bg-[#d6d59b] text-black"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmReceived;
