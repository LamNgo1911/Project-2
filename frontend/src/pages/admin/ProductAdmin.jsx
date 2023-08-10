import React from "react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { useGetSingleProductQuery } from "../../redux/api/backendApi";
import axios from "../../axiosApi/axios";
import { imageAxios } from "../../axiosApi/imageAxios";
import { useSelector } from "react-redux";

const TableCard = ({
  id,
  name,
  price,
  description,
  category,
  colors,
  sizes,
  averageRating,
  numberOfReviews,
  user,
  deal,
}) => {
  const {token} = useSelector(state => state.auth)
  const [show, setShow] = React.useState(false);
  const modelRef = React.useRef(null);

  const handleRemoveClick = async () => {
    await axios.delete(`/products/${id}`, {
      headers: { "Content-Type": "application/json",  Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
  };

  useEffect(() => {
    const handler = (event) => {
      if (!modelRef.current?.contains(event.target)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  return (
    <tbody className="h-full border-t">
      <tr>
        <td className="font-normal text-xs md:text-sm">{id}</td>
        <td className="font-normal text-xs md:text-sm">{user}</td>
        <td className="font-normal text-xs md:text-sm">{name}</td>
        <td className="font-normal text-xs md:text-sm">{price}$</td>
        <td className="font-normal text-xs md:text-sm">{category}</td>
        <td className="font-normal text-xs md:text-sm">{description}</td>
        <td className="font-normal text-xs md:text-sm p-4">
          {colors?.map((item, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-center gap-4 w-[40vw] md:w-[30vw]">
                <p>{item?.color}</p>
                <div className="flex">
                  {item?.images?.map((image) => (
                    <img
                      key={image}
                      src={imageAxios + image}
                      alt="image"
                      className="w-8 h-8 md:w-10 md:h-10 object-fit rounded-lg"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </td>
        <td className="font-normal text-xs md:text-sm">
          {sizes?.map((size, i) =>
            i === sizes.length - 1 ? size : size + " - "
          )}
        </td>
        <td className="font-normal text-xs md:text-sm">{averageRating}</td>
        <td className="font-normal text-xs md:text-sm">{numberOfReviews}</td>
        <td className="font-normal text-xs md:text-sm">{deal}</td>
        <td>
          <div className="flex items-center justify-center gap-2">
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
        </td>
      </tr>
    </tbody>
  );
};

function ProductAdmin() {
  const { id } = useParams();
  const [search, setSearch] = useState("");
  const { data, isFetching, isError } = useGetSingleProductQuery(id);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch("");
  };

  return (
    <div className="pt-[10vh] md:pt-0 px-8 pb-8">
      <div className="flex justify-between pt-8 pb-4">
        <Link
          to="/admin/products"
          className="text-sm md:text-base font-bold border rounded-lg bg-[#ffffff] px-4 py-2"
        >
          Back to Products
        </Link>
      </div>

      <div className="border rounded-lg">
        <div>
          <div className="border rounded-lg w-full overflow-x-scroll">
            <table>
              <thead>
                <tr className="bg-[#c7b5e3]">
                  <th className="text-sm md:text-base font-bold">ID</th>
                  <th className="text-sm md:text-base font-bold">User</th>
                  <th className="text-sm md:text-base font-bold">Name</th>
                  <th className="text-sm md:text-base font-bold">Price</th>
                  <th className="text-sm md:text-base font-bold">category</th>
                  <th className="text-sm md:text-base font-bold">
                    Description
                  </th>
                  <th className="text-sm md:text-base font-bold">
                    Colors + images
                  </th>
                  <th className="text-sm md:text-base font-bold">Sizes</th>
                  <th className="text-sm md:text-base font-bold">
                    AverageRating
                  </th>
                  <th className="text-sm md:text-base font-bold">
                    NumberOfReviews
                  </th>
                  <th className="text-sm md:text-base font-bold">Deal</th>
                  <th className="text-sm md:text-base font-bold">Actions</th>
                </tr>
              </thead>
              <TableCard
                key={data?.product?._id}
                id={data?.product?._id}
                user={data?.product?.user}
                name={data?.product?.name}
                price={data?.product?.price}
                category={data?.product?.category?.name}
                description={data?.product?.description}
                colors={data?.product?.colors}
                sizes={data?.product?.sizes}
                averageRating={data?.product?.averageRating}
                numberOfReviews={data?.product?.numberOfReviews || 0}
                deal={data?.product?.deal?.title}
              />
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductAdmin;
