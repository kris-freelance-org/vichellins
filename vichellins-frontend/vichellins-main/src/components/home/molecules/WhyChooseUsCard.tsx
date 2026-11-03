import { FC, ReactNode } from "react";

interface WhyChooseUsCardProps {
  icon: ReactNode;
  text: string;
}
const WhyChooseUsCard: FC<WhyChooseUsCardProps> = ({ icon, text }) => {
  return (
    <div className="bg-[#F7F7F8] rounded-[2rem] py-[2rem] flex items-center justify-center gap-[2rem]">
      {icon}
      <span className="font-mono text-[1.8rem]">{text}</span>
    </div>
  );
};

export default WhyChooseUsCard;
