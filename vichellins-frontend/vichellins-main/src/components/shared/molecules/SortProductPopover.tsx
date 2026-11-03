"use client"

import { Button } from "@/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { handleSortProductByDateDesc, handleSortProductByPriceAsc, handleSortProductByPriceDesc } from "@/lib/redux/slices/products/productSlice";
import { AppDispatch } from "@/lib/redux/store";
import { ArrowUpDown } from "lucide-react";
import { FC } from "react";
import { useDispatch } from "react-redux";


const SortProductPopover: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          className="w-fit gap-4 justify-start p-6  h-fit "
        >
          <ArrowUpDown size={20} className="text-gray-600" />
          <span className="text-base text-gray-600 font-semibold">Sort</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        avoidCollisions
        side="bottom"
        className="w-fit p-8 bg-white text-base rounded-2xl shadow-lg"
      >
        <div className="flex flex-col ">
          <Button
            onClick={() => dispatch(handleSortProductByPriceAsc())}
            variant={"ghost"}
            className=" justify-normal"
          >
            Price (Asc)
          </Button>
          <Button
            onClick={() => dispatch(handleSortProductByPriceDesc())}
            variant={"ghost"}
            className=" justify-normal"
          >
            Price (Desc)
          </Button>
          <Button
            onClick={() => dispatch(handleSortProductByDateDesc())}
            variant={"ghost"}
            className=" justify-normal"
          >
            Most Recent
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SortProductPopover;
