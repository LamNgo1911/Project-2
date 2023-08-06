import React from "react";
import { imageAxios } from "../axiosApi/imageAxios";
import { AiFillDelete } from "react-icons/ai";
import { removeFromCart, setAmount } from "../redux/service/shoppingSlice";
import { useDispatch } from "react-redux";

function CartCard({ userId, item, name, color, size, price, image, amount }) {
  const dispatch = useDispatch();
  const handleRemoveClick = () => {
    dispatch(removeFromCart({ userId, id: item?.id, color, size }));
  };

  const handleSelectChange = (e) => {
    const quantity = parseInt(e.target.value);
    dispatch(
      setAmount({
        userId,
        id: item?.id,
        color,
        size,
        amount: quantity,
      })
    );
  };
  console.log(amount);
  return (
    <div className="flex flex-col gap-8 items-center justify-between w-full">
      <div className="flex gap-8 items-center justify-between w-full">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-28 md:w-32 border rounded-lg">
            <img
              src={imageAxios + image}
              alt="productImage"
              className="rounded-lg object-contain bg-bg-nav"
            />
          </div>

          <div className="flex flex-col gap-2 text-xs md:text-sm">
            <h1>{name}</h1>
            <p>Color: {color}</p>
            <p>Size: {size}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-xs md:text-sm self-start">
          <div
            onClick={handleRemoveClick}
            className="bg-[#f1edf8] border rounded-lg p-2 font-bold cursor-pointer self-end"
          >
            <AiFillDelete className="text-sm md:text-base text-[#dc3545]" />
          </div>
          <p>Price: ${(price * amount).toFixed(2)}</p>
          <select
            value={amount}
            onChange={handleSelectChange}
            className="w-12 md:w-16 outline-none border"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default CartCard;
