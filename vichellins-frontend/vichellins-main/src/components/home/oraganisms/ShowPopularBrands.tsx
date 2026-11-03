"use client";

import SectionLoader from "@/components/shared/SectionLoader";
import { getAllCategoriesByCustomer } from "@/lib/redux/slices/category/categoryThunk";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ShowPopularBrands = () => {
  const { allCategories, isLoading } = useSelector(
    (store: RootState) => store.categories
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getData = async () => {
      try {
        await dispatch(getAllCategoriesByCustomer());
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  return (
    <div className="space-y-16 w-frame">
      <h5 className="text-[2.5rem] font-semibold "> Browse Popular Brands</h5>

      {!allCategories && isLoading ? (
        <div className="w-full">
          <SectionLoader />
        </div>
      ) : allCategories && allCategories.length == 0 ? (
        <h4 className="p-8 text-base font-semibold flex justify-center ">
          No Category Yet
        </h4>
      ) : (
        <div className="grid lg:grid-cols-3 gap-[2rem]">
          {allCategories?.slice(0, 5)?.map((brand, index) => (
            <Link
              href={`/shop?categoryId=${brand.id}&n=${brand.name}`}
              key={index}
              className={cn(
                "relative  rounded-[1.5rem] overflow-hidden",
                index === 0 ? "lg:col-span-2" : ""
              )}
            >
              <Image
                className="w-full object-cover h-[16rem] lg:h-[24rem]"
                width={600}
                height={280}
                src={brand.image + '?'}
                alt="Brand"
              />
              <div className="absolute top-0 right-0 left-0 bottom-0 bg-slate-600/50 text-[3rem] font-bold grid place-content-center  text-white">
                {brand.name}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// const popularBrands = [
//   {
//     img: "/images/infinix_banner.svg",
//     link: "/",
//   },
//   {
//     img: "/images/redmi_banner.svg",
//     link: "/",
//   },
//   {
//     img: "/images/vivo_banner.svg",
//     link: "/",
//   },
//   {
//     img: "/images/techno_banner.svg",
//     link: "/",
//   },
//   {
//     img: "/images/samsung_banner.svg",
//     link: "/",
//   },
// ];

export default ShowPopularBrands;
