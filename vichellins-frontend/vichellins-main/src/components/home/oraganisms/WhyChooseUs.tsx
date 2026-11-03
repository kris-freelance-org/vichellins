import { ShoppingBag, Truck } from "lucide-react";
import React, { FC } from "react";
import WhyChooseUsCard from "../molecules/WhyChooseUsCard";

const WhyChooseUs: FC = () => {
  return (
    <div className="w-frame grid  lg:grid-cols-3 gap-[2rem]">
      {whyChooseUsData.map((item, index) => (
        <React.Fragment key={index}>
          <WhyChooseUsCard {...item} />
        </React.Fragment>
      ))}
    </div>
  );
};

export default WhyChooseUs;

const whyChooseUsData = [
  {
    icon: <ShoppingBag />,
    text: "Online support",
  },
  {
    icon: <Truck />,
    text: "Fast shipping",
  },
  {
    icon: <Truck />,
    text: "Seamless logistics",
  },
];
