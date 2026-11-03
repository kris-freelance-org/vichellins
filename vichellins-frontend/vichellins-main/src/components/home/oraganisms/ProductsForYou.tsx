"use client";

import ProductGrids from "@/components/shared/ProductGrids";
import SectionHeader from "@/components/shared/SectionHeader";
import SectionLoader from "@/components/shared/SectionLoader";
import { getAllProducts } from "@/lib/redux/slices/products/productThunk";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ProductsForYou: FC = () => {
  const { allProducts, isLoading } = useSelector(
    (store: RootState) => store.products
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getData = async () => {
      try {
        await dispatch(getAllProducts());
      } catch (err) {
        console.log(err);
      }
    };

    getData();
  }, [dispatch]);

  return (
    <div className="space-y-16">
      <SectionHeader
        link="/shop"
        linkText="See all products"
        title="Products for You"
      />
      <div className="w-frame">
        <div className="w-frame">
          {allProducts && allProducts.length > 0 && (
            <ProductGrids allProducts={allProducts} />
          )}
          {!isLoading && allProducts?.length === 0 && (
            <div
              className="h-[20rem] text-2xl text-primary w-full flex justify-center
           items-center"
            >
              Coming Soon...
            </div>
          )}
          {isLoading && !allProducts && <SectionLoader />}
        </div>
      </div>
    </div>
  );
};

export default ProductsForYou;
