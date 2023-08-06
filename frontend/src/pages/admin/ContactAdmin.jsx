import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineSearch, AiFillEye } from "react-icons/ai";
import { useState } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import contactData from "../../data/contactData";

function ContactAdmin() {
  const [search, setSearch] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch("");
  };

  console.log(contactData?.socials);
  return (
    <div className="pt-[10vh] h-screen md:pt-0 px-8 pb-8">
      <div className="flex justify-between pt-8 pb-4">
        <h1 className="text-xl md:text-2xl font-bold">Contact</h1>
      </div>

      <div className="border rounded-lg bg-white">
        <div className="p-4">
          <div className="border rounded-lg w-full overflow-x-scroll">
            <table>
              <tbody>
                <tr className="bg-[#c7b5e3]">
                  <th className="text-sm md:text-base font-bold ">Title</th>
                  <td className="font-normal text-xs md:text-sm">
                    {contactData?.title}
                  </td>
                </tr>
                <tr className="bg-[#c7b5e3]">
                  <th className="text-sm md:text-base font-bold ">
                    Description
                  </th>
                  <td className="font-normal text-xs md:text-sm">
                    {contactData?.desc}
                  </td>
                </tr>
                <tr className="bg-[#c7b5e3]">
                  <th className="text-sm md:text-base font-bold ">Address</th>
                  <td className="font-normal text-xs md:text-sm">
                    {contactData?.address}
                  </td>
                </tr>
                <tr className="bg-[#c7b5e3]">
                  <th className="text-sm md:text-base font-bold ">Phone</th>
                  <td className="font-normal text-xs md:text-sm">
                    {contactData?.phone}
                  </td>
                </tr>
                <tr className="bg-[#c7b5e3]">
                  <th className="text-sm md:text-base font-bold ">Email</th>
                  <td className="font-normal text-xs md:text-sm">
                    {contactData?.email}
                  </td>
                </tr>
                <tr className="bg-[#c7b5e3]">
                  <th className="text-sm md:text-base font-bold ">socials</th>
                  <td className="font-normal text-xs md:text-sm">
                    {contactData?.socials?.map((social, i) => (
                      <a
                        href={social?.link}
                        target="_blank"
                        rel="noreferrer"
                        className="mr-4"
                      >
                        {social?.icon}
                      </a>
                    ))}
                  </td>
                </tr>
                <tr className="bg-[#c7b5e3]">
                  <th className="text-sm md:text-base font-bold">Actions</th>
                  <td>
                    <div className="flex items-center justify-center gap-2">
                      <div className="bg-[#f1edf8] border rounded-lg p-2 font-bold cursor-pointer">
                        <Link to={`/admin/contact/update`}>
                          <AiFillEdit className="text-sm md:text-base text-[#0dcaf0]" />
                        </Link>
                      </div>
                      <div className="bg-[#f1edf8] border rounded-lg p-2 font-bold cursor-pointer">
                        <AiFillDelete className="text-sm md:text-base text-[#dc3545]" />
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactAdmin;
