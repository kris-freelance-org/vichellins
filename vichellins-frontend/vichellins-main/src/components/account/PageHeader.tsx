import { FC } from "react";

interface PageHeaderProps {
  title: string;
  subTitle: string;
}
const PageHeader: FC<PageHeaderProps> = ({ title, subTitle }) => {
  return (
    <div className="mb-10 ">
      <h4 className="text-darkBlue capitalize font-medium text-3xl">{title}</h4>

      <span className="font-medium text-base text-[#667085]">{subTitle}</span>
    </div>
  );
};

export default PageHeader;
