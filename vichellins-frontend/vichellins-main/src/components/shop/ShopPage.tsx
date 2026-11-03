"use client";

import AllCategoriesPopover from "@/components/shared/AllCategoriesPopover";
import SortProductPopover from "@/components/shared/molecules/SortProductPopover";
import PageLoader from "@/components/shared/PageLoader";
import ProductGrids from "@/components/shared/ProductGrids";
import TablePaginations from "@/components/shared/TablePaginations";
import { setSelectedCategory } from "@/lib/redux/slices/category/categorySlice";

import {
  getAllProducts,
  getProductByPriceAndCategory,
} from "@/lib/redux/slices/products/productThunk";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { IProduct } from "@/types/products";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// interface ShopPageProps {}
const ShopPage: FC = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [productsData, setProductsData] = useState<IProduct[] | null>(null);
  const { selectedCategory, allCategories } = useSelector(
    (store: RootState) => store.categories
  );
  const {
    filteredProducts,
    isSearching,
    searchList,
    isLoading,
    currentPage,
    allProducts,
    numberOfPages,
  } = useSelector((store: RootState) => store.products);

  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getData = async () => {
      try {
        setPageLoading(true);
        if (categoryId) {
          dispatch(
            getProductByPriceAndCategory({
              category_id: categoryId as string,
            })
          );
        } else {
          dispatch(getAllProducts());
        }
      } catch (error) {
        console.log(error);
      } finally {
        setPageLoading(false);
      }
    };

    getData();
  }, [categoryId, dispatch]);

  useEffect(() => {
    if (filteredProducts) {
      setProductsData(filteredProducts);
    } else {
      setProductsData(allProducts);
    }
  }, [categoryId, filteredProducts, allProducts, isSearching, searchList]);

  useEffect(() => {
    const getCategory = async () => {
      try {
        setPageLoading(true);

        if (categoryId && allCategories) {
          const found = allCategories.filter((item) => item.id == categoryId);

          dispatch(setSelectedCategory(found[0]));
          // await dispatch(getSingleCategory(categoryId as string));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setPageLoading(false);
      }
    };

    getCategory();
  }, [allCategories, categoryId, dispatch]);

  return (
    <div className="">
      <div className="space-y-32">
        <div className="flex justify-between items-center">
          <AllCategoriesPopover />
          <SortProductPopover />
        </div>
        <div className="space-y-8">
          {(pageLoading || isLoading) && <PageLoader />}

          {productsData && productsData.length > 0 && !isLoading && (
            <>
              <h5 className="font-bold text-[2.2rem] capitalize">
                {selectedCategory ? (
                  <span>
                    Category: <span className="text-primary"> {selectedCategory.name}</span>
                  </span>
                ) : (
                  "All Categories"
                )}
              </h5>
              <hr />
              <ProductGrids allProducts={productsData} />
            </>
          )}
          {!isLoading && productsData?.length === 0 && (
            <div
              className="h-[20rem] text-2xl font-bold text-primary w-full flex justify-center
           items-center"
            >
              Coming Soon...
            </div>
          )}
        </div>

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
  );
};

export default ShopPage;
