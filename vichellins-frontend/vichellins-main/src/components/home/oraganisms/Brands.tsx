import Image from "next/image";
import React from "react";

const Brands = () => {
  return (
    <div className="w-frame space-y-[3rem]">
      <h4 className="font-mono text-center text-[2rem]">WE DEAL IN ALL BRANDS</h4>
      <div className="grid lg:w-[50%] mx-auto grid-cols-3 lg:grid-cols-5 justify-center items-center gap-[1rem]">
        {brandImages.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt="src"
            className="w-[5rem] h-[5rem] justify-self-center object-contain"
            width={100.5}
            height={100.5}
          />
        ))}
      </div>
    </div>
  );
};

export default Brands;

const brandImages = [
  "/images/apple.png",
  "/images/cbi_huawei.png",
  "/images/redmine.png",
  "/images/samsung.png",
  "/images/nokia.png",
];
