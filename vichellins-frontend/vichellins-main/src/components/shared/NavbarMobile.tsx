"use client";
import { FC } from "react";
import { ShoppingCart } from "lucide-react";
import Brand from "./atom/Brand";

import { ProfilePopOver } from "./TopNavbar";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import Link from "next/link";

const NavbarMobile: FC = () => {
  const { cartItems } = useSelector((store: RootState) => store.cart);

  return (
    <div className="flex flex-col gap-4 text-white">
      <div className="flex items-center p-4  bg-primary justify-between">
        <div className="lg:min-w-[40rem]">
          <div className="flex cursor-pointer gap-4 pl-0 ml-0 justify-start">
            <Brand />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Link href={"/cart"} className=" relative">
            <ShoppingCart />
            <span className="absolute -top-4 -right-4 flex justify-center items-center rounded-full bg-rose-500 h-8 w-8 font-bold text-white">
              {(cartItems && cartItems.length) || 0}
            </span>
          </Link>
          <ProfilePopOver />
        </div>
      </div>
      <div className="flex w-[90%] mx-auto"></div>
    </div>
  );
};

export default NavbarMobile;
