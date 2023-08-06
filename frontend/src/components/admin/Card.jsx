import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Card = ({ title, barValue, value, id, backgroundColor }) => {
  const fixedBarValue = barValue?.toFixed(0);
  return (
    <div
      style={{ backgroundColor: backgroundColor }}
      className={`flex flex-col gap-8 p-4 border rounded-lg`}
    >
      <div className="flex justify-between items-center">
        <p className="text-sm md:text-base">{title}</p>
        <CircularProgressbar
          value={fixedBarValue}
          text={`${fixedBarValue < 0 ? fixedBarValue : `+${fixedBarValue}`}%`}
          className="w-12 h-12 md:w-16 md:h-16 border rounded-full"
        />
      </div>

      <div className="flex justify-between items-center">
        <h1 className="font-bold text-base md:text-lg">
          {id === 0 ? `$${value}` : `${value}`}
        </h1>
        <p className="text-xs md:text-sm">Since last month</p>
      </div>
    </div>
  );
};

export default Card;
