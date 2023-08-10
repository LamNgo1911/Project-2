import React, { useRef, useState } from "react";
import { useGetSingleOrderQuery } from "../redux/api/backendApi";
import { useNavigate, useParams } from "react-router-dom";
import OrderReviewCard from "../components/OrderReviewCard";
import axios from "../axiosApi/axios";
import { AiFillExclamationCircle } from "react-icons/ai";
import { useSelector } from "react-redux";

function OrderReview() {
  const { id } = useParams();
  const {token} = useSelector(state => state.auth)
  const { data: orderData } = useGetSingleOrderQuery(id);
  const navigate = useNavigate();
  const [messageError, setMessageError] = useState("");
  const errorRef = useRef();

  // You can manage the ratings and starHover states here as an array of objects
  const [cardStates, setCardStates] = useState([]);

  // Event handlers for when the user hovers over a star or clicks on a star for a specific card
  const handleStarHover = (hoveredRating, cardIndex) => {
    setCardStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[cardIndex] = {
        rating: prevStates[cardIndex]?.rating || 1,
        starHover: hoveredRating,
      };
      return newStates;
    });
  };

  const handleStarLeave = (cardIndex) => {
    setCardStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[cardIndex] = {
        rating: prevStates[cardIndex]?.rating || 1,
        starHover: 1,
      };
      return newStates;
    });
  };

  const handleStarClick = (clickedRating, cardIndex) => {
    setCardStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[cardIndex] = {
        ...prevStates[cardIndex],
        rating: clickedRating,
      };
      return newStates;
    });
  };

  const handleContentChange = (e, cardIndex) => {
    const { value } = e.target;
    setCardStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[cardIndex] = {
        ...prevStates[cardIndex],
        content: value,
      };
      return newStates;
    });
  };

  const handleQualityChange = (e, cardIndex) => {
    const { value } = e.target;
    setCardStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[cardIndex] = {
        ...prevStates[cardIndex],
        quality: value,
      };
      return newStates;
    });
  };

  const handleSubmit = async () => {
    if (!orderData?.order?.orderItems) {
      return; // If there are no order items, return early
    }

    for (let index = 0; index < orderData.order.orderItems.length; index++) {
      const item = orderData.order.orderItems[index];

      try {
        const { data } = await axios.post(
          "/reviews",
          JSON.stringify({
            rating: cardStates[index]?.rating || 5,
            comment: cardStates[index]?.content || "Good",
            quality: cardStates[index]?.quality || "Excellent",
            product: item?.product,
          }),
          {
            headers: { "Content-Type": "application/json" , Authorization: `Bearer ${token}`},
            withCredentials: true,
          }
        );

        if (data) {
          console.log(data);
        }
      } catch (error) {
        // Handle errors that may occur during the review submission
        console.error("Error submitting review:", error?.response?.data?.error);
        setMessageError(error?.response?.data?.error);
        errorRef?.current?.focus();
      }
    }

    try {
      const { data } = await axios.patch(
        `orders/${orderData.order?._id}/updateOrderStatus`,
        JSON.stringify({
          status: "reviewed",
        }),
        {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (data) {
        !messageError && navigate(`/orders`);
        console.log(data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Ensure that orderData is available before rendering
  if (!orderData?.order?.orderItems) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8 pb-8 pt-[100px] px-8 orders">
      <h1 className="text-xl md:text-2xl text-center font-bold">
        Write A Review
      </h1>

      {orderData.order.orderItems.map((item, index) => (
        <OrderReviewCard
          key={index}
          index={index}
          rating={cardStates[index]?.rating || 0}
          starHover={cardStates[index]?.starHover || 0}
          content={cardStates[index]?.content || ""}
          quality={cardStates[index]?.quality || ""}
          handleStarHover={(hoveredRating) =>
            handleStarHover(hoveredRating, index)
          }
          handleStarLeave={() => handleStarLeave(index)}
          handleStarClick={(clickedRating) =>
            handleStarClick(clickedRating, index)
          }
          handleContentChange={(e) => handleContentChange(e, index)}
          handleQualityChange={(e) => handleQualityChange(e, index)}
          item={item}
        />
      ))}

      {messageError && (
        <div
          ref={errorRef}
          className="flex gap-2 items-center self-center text-red-500 text-base md:text-lg text-center"
          aria-live="assertive"
        >
          <AiFillExclamationCircle />
          <p>{messageError}</p>
        </div>
      )}

      <div className="flex justify-center items-center">
        <button
          onClick={handleSubmit}
          className="text-base md:text-lg py-2 px-8 rounded-lg"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default OrderReview;
