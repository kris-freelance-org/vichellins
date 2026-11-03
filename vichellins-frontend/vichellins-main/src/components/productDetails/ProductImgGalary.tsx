import { cn } from "@/lib/utils";
import Image from "next/image";
import { FC, useState } from "react";

interface ProductImgGalaryProps {
  images: string[];
}
const ProductImgGalary: FC<ProductImgGalaryProps> = ({ images }) => {
  const [selectedImg, setSelectedImg] = useState(0);

  return (
    <div className="space-y-6">
      <div className=" w-full lg:w-[62rem] h-[40rem] lg:h-[50rem]">
        <Image
          width={630}
          height={520}
          className="w-full h-full object-contain object-top"
          src={images[selectedImg].trim()}
          alt={images[selectedImg]}
        />
      </div>
      <div className="flex gap-4 h-[10rem] w-fit">
        {images.map(
          (image, index) =>
            image && (
              <button key={index} onClick={() => setSelectedImg(index)}>
                <Image
                  width={140}
                  height={140}
                  className={cn(
                    "h-full w-fit object-cover border border-[#F2DB6B] rounded-md overflow-hidden b-[0px_1px_0px_1px_#00470C26]",
                    selectedImg === index && "border-2 border-primary "
                  )}
                  src={image}
                  alt={image}
                />
              </button>
            )
        )}
      </div>
    </div>
  );
};

export default ProductImgGalary;
