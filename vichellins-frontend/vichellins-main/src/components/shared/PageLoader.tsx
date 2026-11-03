import { Loader2 } from "lucide-react";
import { FC } from "react";

const PageLoader: FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Loader2 className="w-[4rem] h-[4rem] animate-spin text-[#0F164C]" />
    </div>
  );
};

export default PageLoader;
