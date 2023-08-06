import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsCartAdded,
  setIsCartRemoved,
} from "../../redux/service/shoppingSlice";

function CartNoti() {
  const { isCartAdded, isCartRemoved } = useSelector((state) => state.shopping);
  const dispatch = useDispatch();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    if (isCartAdded) {
      setNotificationMessage("Your cart item has been added!");
    } else if (isCartRemoved) {
      setNotificationMessage("Your cart item has been removed!");
    }

    if (isCartAdded || isCartRemoved) {
      setShowNotification(true);

      // Hide the notification after a delay
      setTimeout(() => {
        setShowNotification(false);
        dispatch(setIsCartAdded(false));
        dispatch(setIsCartRemoved(false));
      }, 3000); // 3 seconds
    }
  }, [isCartAdded, isCartRemoved]);

  return (
    <div
      className={`fixed z-[999] bottom-0 right-0 left-0 text-bg-nav justify-center items-center py-4 px-8 ${
        showNotification ? "flex" : "hidden"
      }`}
    >
      <div className="bg-[#51307e] text-bg-nav py-4 px-8 rounded-full">
        <p className="text-sm md:text-lg font-semibold">
          {notificationMessage}
        </p>
      </div>
    </div>
  );
}

export default CartNoti;
