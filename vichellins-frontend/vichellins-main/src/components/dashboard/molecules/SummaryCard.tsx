import { FC, ReactNode } from "react";

interface SummaryCardProps {
  icon: ReactNode;
  text: string;
  value?: number;
  isMoney?: boolean;
}
const SummaryCard: FC<SummaryCardProps> = ({ icon, text, value, isMoney }) => {
  return (
    <div className="px-8 py-6 border rounded-xl space-y-6">
      <div className="w-[4rem] h-[4rem] rounded-full grid place-content-center text-brandYellow bg-primary">
        {icon}
      </div>
      <div className="space-y-1">
        <span className="text-gray-600 text-base">{text}</span>
        <h6 className="text-2xl font-semibold ">
          {isMoney && "N"} {value}
        </h6>
      </div>
    </div>
  );
};

export default SummaryCard;
