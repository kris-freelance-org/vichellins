"use client";

import PageLoader from "@/components/shared/PageLoader";
import ProductGrids from "@/components/shared/ProductGrids";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { IProduct } from "@/types/products";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import {
  getAllProducts,
  searchProducts,
} from "@/lib/redux/slices/products/productThunk";

interface ISearchResults {
  isLoading: boolean;
  productsData: IProduct[] | null;
}
const SearchResults: FC<ISearchResults> = ({ isLoading, productsData }) => {
  const [pageLoading, setPageLoading] = useState(true);
  const searchParams = useSearchParams();

  const searchValue = searchParams.get("value");

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getData = async () => {
      try {
        setPageLoading(true);
        if (searchValue) {
          await dispatch(searchProducts(searchValue));
        } else {
          await dispatch(getAllProducts());
        }
      } catch (error) {
        console.log(error);
      } finally {
        setPageLoading(false);
      }
    };

    getData();
  }, [dispatch, searchValue]);

  return (
    <>
      <div className="space-y-16">
        {(pageLoading || isLoading) && <PageLoader />}

        {productsData && productsData.length > 0 && !isLoading ? (
          <>
            <h5 className="font-bold text-[2.2rem] capitalize">
              Showing results for {searchValue}
            </h5>
            <ProductGrids allProducts={productsData} />
          </>
        ) : (
          <div
            className="h-[20rem] text-2xl font-bold text-primary w-full flex justify-center
           items-center"
          >
            No Result found
          </div>
        )}
      </div>
    </>
  );
};

export default SearchResults;
