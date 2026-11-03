import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { FC } from "react";

interface CustomLoaderProps {
  height?: number;
  width?: number;
  padding?: string;
}
const CustomLoader: FC<CustomLoaderProps> = ({ height, width, padding }) => {
  return (
    <div
      className={cn(
        "flex w-full h-full justify-center items-center",
        padding ? padding : " p-16"
      )}
    >
      <Loader2
        width={width}
        height={height}
        className=" animate-spin text-[#C09730]"
      />
    </div>
  );
};

export default CustomLoader;
