import React from "react";
import { useNavigate } from "react-router-dom";
import { imageAxios } from "../axiosApi/imageAxios";

function CategoryCard({ category }) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/category/${category?.name?.toLowerCase()}`);
  };

  const backgroundImageStyle = {
    backgroundImage: `url(${imageAxios + category?.image})`,
    backgroundPosition: "50%",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  };

  return (
    <div className="max-w-full max-h-full overflow-hidden border rounded-lg">
      <div
        onClick={handleClick}
        className="relative w-full flex flex-col gap-4 justify-start cursor-pointer rounded-lg hover:scale-110 duration-200"
        style={backgroundImageStyle}
      >
        <div className="relative flex flex-row justify-center items-start gap-4 md:h-[240px] h-[180px] w-full p-2 rounded-lg">
          <h1 className="absolute  md:text-2xl text-lg font-bold text-white">
            {category?.name}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default CategoryCard;
