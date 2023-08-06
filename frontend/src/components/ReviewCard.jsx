import React from "react";
import { BsPersonCircle } from "react-icons/bs";

function ReviewCard({ rating, comment, quality, name, date, getStarRating }) {
  const newDate = new Date(date);

  // Function to pad single-digit numbers with leading zeroes
  const padZero = (num) => (num < 10 ? "0" + num : num);

  // Get the day, month, and year from the Date object
  const day = padZero(newDate.getDate());
  const month = padZero(newDate.getMonth() + 1); // Adding 1 since getMonth() returns 0-11
  const year = newDate.getFullYear();

  // Construct the "dd/mm/yyyy" formatted date string
  const formattedDate = `${day}/${month}/${year}`;

  return (
    <div className="flex flex-col gap-1">
      <p>{getStarRating(rating)}</p>
      <p className="font-semibold text-base md:text-lg">{quality}</p>
      <small className="text-xs md:text-sm">{comment}</small>
      <div className="flex items-center gap-2">
        <BsPersonCircle className="md:w-10 md:h-10 w-8 h-8 rounded-full bg-bg-nav" />
        <div className="flex flex-col gap-1">
          <p>{name}</p>
          <p className="text-xs md:text-sm">{formattedDate}</p>
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;
