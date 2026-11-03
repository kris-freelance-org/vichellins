import Image from "next/image";
import React from "react";

const Featured = () => {
  return (
    <div className="w-frame space-y-[3rem] ">
      <h5 className="text-[2.5rem] font-semibold ">Featured</h5>
      <Image
        src={"/images/infinix_noe11_banner.svg"}
        alt=""
        width={1280}
        height={360}
      />
    </div>
  );
};

export default Featured;
