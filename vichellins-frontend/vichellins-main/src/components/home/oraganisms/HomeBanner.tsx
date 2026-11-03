import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

// interface HomeBannerProps {}
const HomeBanner: FC = () => {
  return (
    <div className="w-frame h-[30.5rem] lg:h-[60rem] ">
      <Link href={"/"}>
        <Image
          src={"/images/redmi_note_11_banner.png"}
          alt="banner"
          width={1300}
          height={700}
          className="w-full h-full object-cover rounded-[2rem] lg:rounded-[4rem]"
        />
      </Link>
    </div>
  );
};

export default HomeBanner;
