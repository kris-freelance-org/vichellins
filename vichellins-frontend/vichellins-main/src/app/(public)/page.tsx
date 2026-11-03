import Brands from "@/components/home/oraganisms/Brands";
import Featured from "@/components/home/oraganisms/Featured";

import HomeBanner from "@/components/home/oraganisms/HomeBanner";
import ProductsForYou from "@/components/home/oraganisms/ProductsForYou";
import ShowPopularBrands from "@/components/home/oraganisms/ShowPopularBrands";
import TodaysDeal from "@/components/home/oraganisms/TodaysDeal";
import WhyChooseUs from "@/components/home/oraganisms/WhyChooseUs";
import { FC } from "react";

// interface HomepageProps {}
const Homepage: FC = () => {
  return (
    <div className="space-y-[6rem] mt-8">
      <HomeBanner />
      <Brands />
      <WhyChooseUs />
      <ShowPopularBrands />
      <TodaysDeal />
      <Featured />
      <ProductsForYou />
    </div>
  );
};

export default Homepage;
