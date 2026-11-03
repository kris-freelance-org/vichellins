"use client";

import { AppDispatch, RootState } from "@/lib/redux/store";
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Menu, X } from "lucide-react";
import { Button, buttonVariants } from "../ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getAllCategoriesByCustomer } from "@/lib/redux/slices/category/categoryThunk";
import CustomLoader from "./atom/CustomLoader";
import { setSelectedCategory } from "@/lib/redux/slices/category/categorySlice";

const AllCategoriesPopover: FC = () => {
  const { allCategories, isLoading } = useSelector(
    (store: RootState) => store.categories
  );
  const [isOpen, setIsOpen] = useState(false);

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
  }, [dispatch]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant={"ghost"} className=" text-black gap-4  justify-start">
          <Menu />
          <span className="hidden lg:block">All Categories</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        avoidCollisions
        side="bottom"
        className="w-[40rem] h-[100rem]  bg-white text-base rounded-none border-none shadow-none"
      >
        <div className="space-y-8 relative  p-8">
          <h5 className="font-semibold text-[1.8rem]">Categories</h5>
          <div className="flex flex-col ">
            <Link
              onClick={() => { dispatch(setSelectedCategory(null)); setIsOpen(false)}}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className: "justify-start capitalize",
                })
              )}
              href={`/shop`}
            >
              All Categories
            </Link>
            {isLoading && !allCategories ? (
              <CustomLoader height={26} width={26} />
            ) : !isLoading && allCategories && allCategories.length == 0 ? (
              <p className="p-4 bg-slate-100 grid place-content-center ">
                No Data
              </p>
            ) : (
              allCategories &&
              allCategories.map((category) => (
                <Link
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    buttonVariants({
                      variant: "ghost",
                      className: "justify-start capitalize",
                    })
                  )}
                  href={`/shop?categoryId=${
                    category.id
                  }&n=${category.name.replaceAll(" ", "_")}`}
                  key={category.id}
                >
                  {category.name}
                </Link>
              ))
            )}
          </div>
          <Button
            onClick={() => setIsOpen(false)}
            variant={"ghost"}
            className="absolute w-fit p-2 top-0 right-10"
          >
            <X size={16} />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AllCategoriesPopover;
