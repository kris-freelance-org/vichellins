import { FC, useState } from "react";
import { useTargetBreakpoint } from "@/hooks/useTargetBreakpoint";
import { TableHeader, TableHead, TableRow } from "../ui/table";

interface CustomTableHeaderProps {
  headingList: string[];
}
const CustomTableHeader: FC<CustomTableHeaderProps> = ({ headingList }) => {
  const [isMobile, setIsMobile] = useState(false);
  useTargetBreakpoint({ setIsMobile, breakPoint: 800 });
  return (
    <TableHeader className="h-[5.5rem] bg-primary w-full">
      <TableRow className="h-full border-b-0 w-full">
        <TableHead className="min-w-[5rem]">S/N</TableHead>
        {headingList
          .slice(0, isMobile ? 3 : headingList.length)
          .map((heading, index) => (
            <TableHead key={index} className="">
              <span>{heading}</span>
            </TableHead>
          ))}
        <TableHead className=""></TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default CustomTableHeader;
