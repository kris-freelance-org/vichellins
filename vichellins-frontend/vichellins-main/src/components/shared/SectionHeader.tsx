import { cn } from "@/lib/utils";
import Link from "next/link";
import { FC } from "react";
import SectionBadge from "./molecules/SectionBadge";
import { buttonVariants } from "../ui/Button";

interface SectionHeaderProps {
  title: string;
  link: string;
  linkText: string;
}

const SectionHeader: FC<SectionHeaderProps> = ({ title, linkText, link }) => {
  return (
    <div className={cn("p-6")}>
      <div className="w-frame space-y-[1rem]">
        <SectionBadge title="Hot Now" />
        <div className="flex justify-between items-center">
          <div className=" flex flex-col lg:flex-row lg:items-center gap-[1rem]">
            <h5 className="text-[2.1rem] lg:text-[3.2rem] font-semibold ">
              {title}
            </h5>
            <div className="py-[1rem] px-[2rem] rounded-[1rem] font-bold text-[1rem] lg:text-[1.4rem] bg-[#EDEFFD] border border-[#CCD2FF] ">
              at over 20% discount
            </div>
          </div>

          <Link href={link} className={cn("text-[1.2rem]", buttonVariants({}))}>
            {linkText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;
