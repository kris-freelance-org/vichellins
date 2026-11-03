import { Button } from "@/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Eye, Pen } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { SlOptionsVertical } from "react-icons/sl";

interface OrderTablePopoverProps {
  selectedId: string | null;
}
const OrderTablePopover: FC<OrderTablePopoverProps> = ({ selectedId }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost">
          <SlOptionsVertical />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        avoidCollisions
        side="right"
        className="w-fit p-8 bg-white text-base rounded-2xl shadow-lg"
      >
        <div className="flex flex-col gap-3 text-base ">
          <Link
            href={`/admin/orders/${selectedId}`}
            className="flex gap-3 items-center justify-start "
          >
            <Eye size={16} />
            View Order
          </Link>

          <Button
            className=" text-[#555856] items-center  justify-start gap-3 pl-0"
            variant="ghost"
          >
            <Pen size={16} />
            Change Status
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default OrderTablePopover;
