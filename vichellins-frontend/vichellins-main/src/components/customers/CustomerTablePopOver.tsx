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


interface CustomerTablePopOverProps {
  selectedId: string | null;
}
const CustomerTablePopOver: FC<CustomerTablePopOverProps> = ({
  selectedId,
}) => {
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
            href={`/admin/customers/${selectedId}`}
            className="flex gap-3 items-center justify-start "
          >
            <Eye size={16} />
            View Customer
          </Link>

           <Link
            href={`/admin/customers/${selectedId}/orders`}
            className="flex gap-3 items-center justify-start "
          >
           <Pen size={16} />
            See Order History
          </Link>

          
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CustomerTablePopOver;
