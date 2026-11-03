"use client";

import AllCategoriesPopover from "@/components/shared/AllCategoriesPopover";
import SortProductPopover from "@/components/shared/molecules/SortProductPopover";
import PageLoader from "@/components/shared/PageLoader";
import SearchResults from "@/components/shop/SearchResults";
import { Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import TablePaginations from "@/components/shared/TablePaginations";
import { getAllProducts } from "@/lib/redux/slices/products/productThunk";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { IProduct } from "@/types/products";

const SearchPage = () => {
  const [productsData, setProductsData] = useState<IProduct[] | null>(null);
  const {
    filteredProducts,
    isSearching,
    searchList,
    isLoading,
    currentPage,
    allProducts,
    numberOfPages,
  } = useSelector((store: RootState) => store.products);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (filteredProducts) {
      setProductsData(filteredProducts);
    } else {
      setProductsData(allProducts);
    }
  }, [filteredProducts, allProducts, isSearching, searchList]);

  return (
    <div className="w-frame ">
      <div className="">
        <div className="space-y-32">
          <div className="flex justify-between items-center">
            <AllCategoriesPopover />
            <SortProductPopover />
          </div>

          <Suspense fallback={<PageLoader />}>
            <SearchResults productsData={productsData} isLoading={isLoading} />
          </Suspense>

          <TablePaginations
            currentPage={currentPage}
            handleSelectPage={async (page) =>
              await dispatch(getAllProducts(page))
            }
            numberOfPages={numberOfPages}
            handlePrevPage={async () =>
              await dispatch(
                getAllProducts(currentPage > 1 ? currentPage - 1 : currentPage)
              )
            }
            handleNextPage={async () =>
              await dispatch(getAllProducts(currentPage + 1))
            }
          />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
