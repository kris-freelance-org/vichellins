"use client"

import ProductImgGalary from "@/components/productDetails/ProductImgGalary";
import ProductInfo from "@/components/productDetails/ProductInfo";
import ProductGrids from "@/components/shared/ProductGrids";

import CustomLoader from "@/components/shared/atom/CustomLoader";
import {
  getAllProducts,
  getProductReview,
  getSingleProduct,
} from "@/lib/redux/slices/products/productThunk";
import { AppDispatch, RootState } from "@/lib/redux/store";
import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import PageLoader from "@/components/shared/PageLoader";
import SectionHeader from "@/components/shared/SectionHeader";
import { useParams } from "next/navigation";


const ProductDetails: FC = () => {
  const [isLoading, setLoading] = useState(false);
  const { selectedProduct, allProducts } = useSelector(
    (store: RootState) => store.products
  );

  const { productId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        if (productId) {
          await dispatch(getSingleProduct(productId as string));
          await dispatch(getProductReview(productId as string));
          await dispatch(getAllProducts());
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [productId, dispatch]);

  return (
    <>
      {isLoading ? (
        <PageLoader />
      ) : (
        <div className="mt-8  space-y-32">
          <div className="w-frame grid lg:grid-cols-[2fr_2fr] gap-10 lg:gap-20">
            {selectedProduct ? (
              <React.Fragment>
                <ProductImgGalary
                  images={[
                    selectedProduct?.mainImage ?? "",
                    selectedProduct?.rightImage ?? "",
                    selectedProduct?.leftImage ?? "",
                    selectedProduct?.extraImage ?? "",
                  ]}
                />
              </React.Fragment>
            ) : (
              <CustomLoader width={20} height={20} />
            )}
            <div className="w-full">
              <ProductInfo />
            </div>
          </div>

          <div className="space-y-8">
            <SectionHeader title="More like this" linkText="See All " link="/shop" />
            {allProducts ? (
              <div className="w-frame">
                <ProductGrids
                  filterId={selectedProduct?.id}
                  allProducts={allProducts.slice(0, 10)}
                />
              </div>
            ) : (
              <div>
                <CustomLoader width={20} height={20} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
