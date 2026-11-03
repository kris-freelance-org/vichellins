import Image from "next/image";
import Link from "next/link";
import { FC } from "react";



const Brand: FC = () => {
  return (
    <Link href="/">
      <Image
        width={150}
        height={150}
        className="w-[12.3rem] h-[4.2rem] object-contain"
        src="/images/vichellins_logo.png"
        alt=""
        
      />
    </Link>
  );
};

export default Brand;
