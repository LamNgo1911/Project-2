import React from "react";

function ServiceCard() {
  return (
    <div className="h-[360px] w-full border rounded-lg cursor-pointer">
      <div className="flex flex-col gap-4 px-4 justify-center items-start h-[40%]">
        <h2 className="font-semibold text-lg md:text-xl">
          Frequently Asked Questions
        </h2>
        <p className="text-sm md:text-base">
          Updates on safe Shopping in our Stores
        </p>
      </div>
      <div className="h-[60%] max-h-[60%] max-w-full overflow-hidden rounded-b-lg">
        <img
          src="https://blossombrook.com.au/wp-content/uploads/family-photoshoot-sydney-20-500x300.jpg"
          alt="image"
          className="h-full object-fill w-full hover:scale-110 duration-200"
        />
      </div>
    </div>
  );
}

export default ServiceCard;
