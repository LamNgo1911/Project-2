import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsFavoriteAdded,
  setIsFavoriteRemoved,
} from "../../redux/service/shoppingSlice";

function FavoriteNoti() {
  const { isFavoriteAdded, isFavoriteRemoved } = useSelector(
    (state) => state.shopping
  );
  const dispatch = useDispatch();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    if (isFavoriteAdded) {
      setNotificationMessage("Your favorite item has been added!");
    } else if (isFavoriteRemoved) {
      setNotificationMessage("Your favorite item has been removed!");
    }

    if (isFavoriteAdded || isFavoriteRemoved) {
      setShowNotification(true);

      // Hide the notification after a delay
      setTimeout(() => {
        setShowNotification(false);
        dispatch(setIsFavoriteAdded(false));
        dispatch(setIsFavoriteRemoved(false));
      }, 3000); // 3 seconds
    }
  }, [isFavoriteAdded, isFavoriteRemoved]);

  return (
    <div
      className={`fixed z-[999] bottom-0 right-0 left-0 text-bg-nav justify-center items-center py-4 px-8 ${
        showNotification ? "flex" : "hidden"
      }`}
    >
      <div className="bg-[#51307e] text-bg-nav py-4 px-8 rounded-full">
        <p className="text-lg md:text-xl font-semibold">
          {notificationMessage}
        </p>
      </div>
    </div>
  );
}

export default FavoriteNoti;
