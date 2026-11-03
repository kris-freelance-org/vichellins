"use client"

import { cn } from "@/lib/utils";
import { FC } from "react";
import { buttonVariants } from "../ui/Button";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface TabsBoxProps {
  tabs: {
    name: string;
    link: string;
  }[];
}

const TabsBox: FC<TabsBoxProps> = ({ tabs }) => {
  const pathname = usePathname();

  return (
    <div>
      {tabs.map((tab, index) => (
        <Link
          href={tab.link}
          key={index}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "h-24  hover:bg-transparent border-b-4 border-transparent rounded-none hover:border-[hsl(138,63%,36%)], ",
            ((tab.link !== "/account" &&
              pathname.includes(tab.link)) ||
              (pathname === "/account" &&
                pathname === tab.link)) &&
              "border-primary"
          )}
        >
          {tab.name}
        </Link>
      ))}
      <hr />
    </div>
  );
};

export default TabsBox;
