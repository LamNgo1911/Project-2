import React from "react";
import { AiFillEye, AiFillEdit, AiFillDelete } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../axiosApi/axios";
import Loading from "../../components/Loading";

const ProductCardAdmin = ({ image, name, price, id, oldPrice, loading }) => {
  const navigate = useNavigate();

  const handleRemoveClick = async () => {
    await axios.delete(`/products/${id}`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
  };

  return (
    <>
      {loading ? (
        <div className="relative">
          <Loading />
        </div>
      ) : (
        <div className="w-full h-[340px] sm:h-[420px] border rounded-lg flex flex-col bg-white">
          <div className="max-w-full max-h-[60%] h-[60%] overflow-hidden rounded-t border">
            <img
              src={"http://localhost:5000" + image}
              alt="image"
              className="w-full h-full object-fit hover:scale-110 cursor-pointer"
            />
          </div>

          <div className="flex flex-col justify-center items-center h-[40%] md:gap-4 gap-2 py-4">
            <div className="flex flex-col px-4 w-full">
              <h1 className="text-xs md:text-sm w-full">{name}</h1>
              <div className="flex items-center justify-between">
                <p className="text-sm md:text-base font-bold">{price}$</p>
                {price !== oldPrice && (
                  <div className="flex items-center gap-2">
                    <p className="text-sm md:text-base line-through">
                      {oldPrice}$
                    </p>
                    <p className="text-sm md:text-base border rounded-lg p-1 bg-red-500 text-white">
                      -{100 - ((price / oldPrice) * 100).toFixed(0)}%
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div
                className="bg-[#f1edf8] border rounded-lg p-2 font-bold cursor-pointer"
                onClick={() => navigate(`/admin/products/${id}`)}
              >
                <AiFillEye className="text-sm md:text-base text-[#198754]" />
              </div>
              <div className="bg-[#f1edf8] border rounded-lg p-2 font-bold cursor-pointer">
                <Link to={`/admin/products/${id}/update`}>
                  <AiFillEdit className="text-sm md:text-base text-[#0dcaf0]" />
                </Link>
              </div>
              <div
                onClick={handleRemoveClick}
                className="bg-[#f1edf8] border rounded-lg p-2 font-bold cursor-pointer"
              >
                <AiFillDelete className="text-sm md:text-base text-[#dc3545]" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCardAdmin;
