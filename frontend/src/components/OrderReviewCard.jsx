import React from "react";
import { imageAxios } from "../axiosApi/imageAxios";

function OrderReviewCard({
  index,
  rating,
  starHover,
  content,
  quality,
  handleStarHover,
  handleStarClick,
  handleStarLeave,
  handleContentChange,
  handleQualityChange,
  item,
}) {
  console.log(rating, quality, content);
  return (
    <div className="grid md:grid-cols-2 gap-8 justify-items-center pb-8 border-t py-4">
      <div className="justify-self-start md:justify-self-center text-xs md:text-sm">
        <div className="h-48 w-36 md:h-56 md:w-44 rounded-lg border overflow-hidden">
          <img
            src={imageAxios + item?.image}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-1">
          <p>{item?.name}</p>
          <p>
            {item?.color} / {item?.size}
          </p>
          <p>Price: {item?.price}</p>
          <p>Qty: {item?.amount}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 flex-wrap justify-self-start md:justify-self-center text-xs md:text-sm">
        <div className="flex items-center gap-8 flex-wrap">
          <p className="font-bold">Rating</p>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-2xl md:text-3xl cursor-pointer ${
                  star <= rating || star <= starHover || star === 1
                    ? "text-yellow-300"
                    : ""
                }`}
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={() => handleStarLeave()}
                onClick={() => handleStarClick(star)}
              >
                ☆
              </span>
            ))}
          </div>
        </div>
        <label htmlFor="content" className="flex gap-8 flex-wrap font-bold">
          Content
          <textarea
            name="content"
            id="content"
            cols="30"
            rows="5"
            className="border py-2 px-4 font-normal"
            value={content}
            onChange={(e) => handleContentChange(e)}
          />
        </label>
        <div>
          <div className="flex gap-8 items-center flex-wrap">
            <p className="font-bold">Quality</p>
            <div className="flex gap-8 items-center">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="Excellent"
                  name={`Quality-${index}`}
                  value="Excellent"
                  className="border"
                  onChange={(e) => handleQualityChange(e)}
                  checked
                />
                <label htmlFor="Excellent">Excellent</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="Average"
                  name={`Quality-${index}`}
                  value="Average"
                  className="border"
                  onChange={(e) => handleQualityChange(e)}
                />
                <label htmlFor="Average">Average</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="Poor"
                  name={`Quality-${index}`}
                  value="Poor"
                  className="border"
                  onChange={(e) => handleQualityChange(e)}
                />
                <label htmlFor="Poor">Poor</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderReviewCard;
