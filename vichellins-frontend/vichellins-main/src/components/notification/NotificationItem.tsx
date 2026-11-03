import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "../ui/Button";
import { ChevronRight, Volume2 } from "lucide-react";


const NotificationItem = ({
  message,
  type,
  title,
  meta,
}: {
  message: string;
  title: string;
  type: string;
  meta: string;
}) => {
  return (
    <div className=" grid gap-[2rem] min-h-[100px] grid-cols-[66px_1fr_200px] p-[2rem] rounded-[1.2rem] bg-white shadow-[0px_1px_4px_0px_#51519E14]">
      <Volume2 width={68} height={33} />
      <div className="font-normal text-base">
        <h6 className="font-bold">{title}</h6>
        <span>{message}</span>
      </div>
      <Link
        className={cn(
          buttonVariants({
            variant: "ghost",
            className: "uppercase text-primary hidden md:flex",
          })
        )}
        href={`/admin/${type}/${meta}`}
      >
        See Details
        <ChevronRight />
      </Link>
    </div>
  );
};

export default NotificationItem;
