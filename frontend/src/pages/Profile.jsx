import React from "react";
import { useSelector } from "react-redux";

function Profile() {
  const { user } = useSelector((state) => state.auth);
  console.log(user);
  return (
    <div className="w-full h-screen pt- border pt-[100px] flex flex-col items-center">
      <div className=" border rounded-lg md:w-[50%] w-[80%] h-[80vh] flex flex-col items-center gap-12 p-8 bg-[#c4dee5]">
        <h1 className="font-extrabold text-2xl md:text-3xl">My profile</h1>
        <div className="w-full text-sm md:text-base">
          <p>
            <span className="font-bold">User name:</span> {user?.name}
          </p>
          <p>
            <span className="font-bold">Email:</span> {user?.email}
          </p>
          <p>
            <span className="font-bold">Role:</span> {user?.role}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
