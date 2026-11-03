"use client" 

import SectionHeader from "@/components/shared/SectionHeader";
import { FC, useEffect } from "react";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { useDispatch, useSelector } from "react-redux";
import ProductGrids from "@/components/shared/ProductGrids";
import { getPopularProducts } from "@/lib/redux/slices/products/productThunk";
import SectionLoader from "@/components/shared/SectionLoader";

const TodaysDeal: FC = () => {
  const { popularProducts, isLoading } = useSelector(
    (store: RootState) => store.products
  );
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const getData = async () => {
      try {
        await dispatch(getPopularProducts());
      } catch (err) {
        console.log(err);
      }
    };

    getData();
  }, [dispatch]);

  return (
    popularProducts &&
    popularProducts.length > 0 && (
      <div className="space-y-16">
        <SectionHeader
          title="Fast Selling"
          linkText="See all products"
          link="/shop"
        />

        <div className="w-frame">
          {popularProducts && popularProducts.length > 0 && (
            <ProductGrids allProducts={popularProducts} />
          )}
          {!isLoading && popularProducts?.length === 0 && (
            <div
              className="h-[20rem] text-2xl text-primary w-full flex justify-center
           items-center"
            >
              Coming Soon...
            </div>
          )}
          {isLoading && !popularProducts && (
           <SectionLoader />
          )}
        </div>
      </div>
    )
  );
};

export default TodaysDeal;
