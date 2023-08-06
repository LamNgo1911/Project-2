import React from "react";
import { AiFillHeart } from "react-icons/ai";

import { Navigation, Thumbs } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import { imageAxios } from "../axiosApi/imageAxios";
import { useDispatch } from "react-redux";
import { addToFavorite } from "../redux/service/shoppingSlice";

function ImageCard({ colors, color, product }) {
  const dispatch = useDispatch();
  const [thumbsSwiper, setThumbsSwiper] = React.useState(null);
  const images = colors?.filter(
    (item) => item?.color === color?.toLowerCase()
  )?.[0]?.images;

  // hanlde add favorite
  const hanldeAddFavorite = () => {
    dispatch(addToFavorite(product));
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="h-[360px] sm:h-[420px] lg:h-[580px] w-full bg-bg-nav rounded-lg overflow-hidden">
        <Swiper
          modules={[Navigation, Thumbs]}
          navigation
          spaceBetween={10}
          thumbs={{ swiper: thumbsSwiper }}
          loop={true}
          grabCursor={true}
          className="h-full w-full big-image"
        >
          {images?.map((image, index) => (
            <SwiperSlide key={index} className="relative">
              <img
                src={imageAxios + image}
                alt=""
                className="absolute top-0 left-0 h-full w-full object-fit cursor-pointer"
              />
              <AiFillHeart
                onClick={hanldeAddFavorite}
                className="absolute top-3 right-3 border rounded-full 
                text-2xl p-1 md:p-2 md:text-4xl bg-bg-nav cursor-pointer"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="h-[80px] sm:h-[120px] lg:h-[160px] rounded-lg overflow-hidden flex w-full">
        <Swiper
          onSwiper={setThumbsSwiper}
          navigation
          modules={[Navigation, Thumbs]}
          slidesPerView={4}
          spaceBetween={10}
          className="h-full w-full small-image max-width-full max-h-full min-h-0 min-w-0"
        >
          {images?.map((image, index) => (
            <SwiperSlide key={index} className="relative opacity-50">
              <img
                src={imageAxios + image}
                alt=""
                className="absolute top-0 left-0 h-full w-full rounded-lg object-fit cursor-pointer"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default ImageCard;
