"use client";

import { FC } from "react";
import { FaFacebookF } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";
import { FaTiktok } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import Brand from "./atom/Brand";
import Link from "next/link";

const Footer: FC = () => {
  const { userProfile } = useSelector((store: RootState) => store.auth);
  const { allCategories } = useSelector((store: RootState) => store.categories);

  return (
    <div className="bg-primary text-white text-base">
      <div className="w-frame py-16 flex flex-col lg:flex-row gap-16 justify-between">
        <div className="flex flex-col gap-8">
          <Brand />

          <span className="text-[1.6rem]">
          Dealers in all brands of phones and accessories 
          </span>

          <div className="flex items-center gap-4">
            <Link href={"/"}>
              <FaFacebookF size={22} className="text-white" />
            </Link>
            <Link href={"/"}>
              <RiInstagramFill size={22} className="text-white" />
            </Link>
            <Link href={"/"}>
              <FaTiktok size={22} className="text-white" />
            </Link>
          </div>
        </div>
        <div className="flex gap-16 lg:gap-20 flex-wrap">
          <div className=" flex flex-col gap-8">
            <Link href={"/shop"}>All Categories</Link>
            {allCategories &&
              allCategories.slice(0, 5).map((category) => (
                <Link
                  key={category.id}
                  href={`/shop/categories/${category.id}`}
                >
                  {category.name}
                </Link>
              ))}
          </div>
          <div className=" flex flex-col gap-8">
            <Link href={"/privacy-policy"}>Privacy Policy </Link>
            <Link href={"/terms-and-conditions"}>Terms and Condition </Link>
            {/* <Link href={"/about"}>About Us </Link> */}
          </div>
          <div className=" flex flex-col gap-8">
            <Link href={"/contact-us"}>Contact Us </Link>
            {userProfile ? (
              <Link href={"/account"}>Account </Link>
            ) : (
              <Link href={"/login"}>Login </Link>
            )}
            <Link href={"/cart"}>Cart </Link>
            <Link href={"/account/orders"}>Orders </Link>
          </div>
        </div>
      </div>
      <div className="flex items-center p-4 justify-center border-t border-[#00470C]">
        &copy; Copyright {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default Footer;
