import React from "react";
function Loading() {
  return (
    <div className="flex flex-col gap-8 justify-center items-center h-[340px] sm:h-[420px] bg-[#f1f1f1]">
      <h1 className="md:text-2xl text-xl text-black-100">WearMeOut</h1>
      <div className="w-[200px] h-[20px] animate-loading border bg-[#ccc]"></div>
    </div>
  );
}

export default Loading;
