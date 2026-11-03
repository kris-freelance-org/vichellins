"use client";

import { FC, useContext, useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { ArrowLeft } from "lucide-react";

import UploadImgArea from "./molecules/UploadImgArea";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { cn } from "@/lib/utils";
import { updateProductStateValues } from "@/lib/redux/slices/products/productSlice";
import {
  getSingleProduct,
  updateProduct,
} from "@/lib/redux/slices/products/productThunk";
import { toast } from "@/hooks/useToast";
import PageLoader from "../shared/PageLoader";
import { useParams, useRouter } from "next/navigation";
import { ProductFileContext } from "@/context/productFile";

interface UploadProductImagesProps {
  addProductImage?: boolean;
}

const UploadProductImages: FC<UploadProductImagesProps> = ({
  addProductImage,
}) => {
  const [isPageLoading, setPageIsLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const { selectedProductAdmin } = useSelector(
    (store: RootState) => store.products
  );

  const dispatch = useDispatch<AppDispatch>();
  const productImageContext = useContext(ProductFileContext);
  if (!productImageContext) {
    throw new Error("ProductFileContext is undefined");
  }
  const { productImageState, updateProductImageState } = productImageContext;

  const { productId } = useParams();

  useEffect(() => {
    const getData = async () => {
      if (!productId) {
        return dispatch(
          updateProductStateValues({
            name: "selectedProductAdmin",
            value: null,
          })
        );
      }
      try {
        setPageIsLoading(true);
        await dispatch(getSingleProduct(productId as string));
      } catch (error) {
        console.log(error);
      } finally {
        setPageIsLoading(false);
      }
    };

    getData();
  }, [dispatch, productId]);

  useEffect(() => {
    if (selectedProductAdmin) {
      updateProductImageState({
        type: "update",
        payload: {
          main: {
            ...productImageState.main,
            imageUrl: selectedProductAdmin.mainImage ,
          },
           right: {
          ...productImageState.right,
          imageUrl: selectedProductAdmin.rightImage,
        },
        left: {
          ...productImageState.left,
          imageUrl: selectedProductAdmin.leftImage,
        },
        extra: {
          ...productImageState.extra,
          imageUrl: selectedProductAdmin.extraImage,
        },
        },
       
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProductAdmin]);

  const navigate = useRouter();

  const handleUploadProductImages = async () => {
    try {
      setIsLoading(true);
      if (!productImageState.main?.image && !productImageState.main?.imageUrl) {
        return toast({
          title: "Invalid Input",
          description: "Please Supply at Least The Main Image",
          variant: "destructive",
        });
      }
      if (!selectedProductAdmin) {
        return toast({
          title: "No Product Selected",
          description: "Something Wrong Wrong",
          variant: "destructive",
        });
      }

      //   Upload MAin Image
      const postData = new FormData();

      postData.append("name", selectedProductAdmin.name);
      postData.append("price", selectedProductAdmin.price.toString());
      postData.append("categoryId", selectedProductAdmin.categoryId);
      postData.append("description", selectedProductAdmin.description);

      if (productImageState.main?.image) {
        postData.append("image", productImageState.main?.image);
      }
      if (productImageState.left?.image) {
        postData.append("image", productImageState.left?.image);
      }
      if (productImageState.right?.image) {
        postData.append("image", productImageState.right?.image);
      }
      if (productImageState.extra?.image) {
        postData.append("image", productImageState.extra?.image);
      }

      //   Upload Product Information
      const resInfo = await dispatch(
        updateProduct({
          product_id: selectedProductAdmin.id,
          info: postData,
        })
      );

      if (resInfo.type.includes("rejected")) {
        return toast({
          title: "An Error Occurred",
          description: resInfo.payload as string,

          variant: "destructive",
        });
      }

      return toast({
        title: "Product Image Uploaded ",
        description: "The Product Image was Uploaded successfully",
        variant: "success",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8  p-8 bg-white">
      {!isPageLoading ? (
        <>
          {!addProductImage && (
            <div
              className={cn(
                "grid justify-between",
                !addProductImage ? "grid-cols-2" : "grid-cols-1"
              )}
            >
              <div className="flex gap-3 ">
                <Button
                  variant={"ghost"}
                  className="p-0 m-0"
                  onClick={() => navigate.back()}
                >
                  <ArrowLeft size={20} />
                </Button>
                <div className="space-y-2">
                  <div className="flex flex-col  mb-8">
                    <h5 className="text-[#3F434A] text-2xl font-manjari font-bold">
                      Update Product Images
                    </h5>

                    <span className="font-normal text-base">
                      Upload Images Here
                    </span>
                  </div>
                  <div className="text-[1.2rem]">
                    Product Name:{" "}
                    <span className="font-bold">
                      {selectedProductAdmin?.name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-self-end ">
                <Button
                  onClick={handleUploadProductImages}
                  isLoading={isLoading}
                >
                  Save
                </Button>
              </div>
            </div>
          )}
          <div className="space-y-6">
            <div className="grid items-center gap-3 md:grid-cols-[1fr_2fr]">
              <label className="text-base font-semibold">Main View</label>
              <div className=" md:w-[80%]">
                <UploadImgArea
                  name="main"
                  imageURL={productImageState.main?.imageUrl}
                />
              </div>
            </div>
            <hr />
            <div className="grid items-center gap-3 md:grid-cols-[1fr_2fr]">
              <label className="text-base font-semibold">Right Side View</label>
              <div className=" md:w-[80%]">
                <UploadImgArea
                  name="right"
                  imageURL={productImageState.right?.imageUrl}
                />
              </div>
            </div>
            <hr />
            <div className="grid items-center gap-3 md:grid-cols-[1fr_2fr]">
              <label className="text-base font-semibold">Left Side View</label>
              <div className=" md:w-[80%]">
                <UploadImgArea
                  name="left"
                  imageURL={productImageState.left?.imageUrl}
                />
              </div>
            </div>
            <hr />
            <div className="grid items-center gap-3 md:grid-cols-[1fr_2fr]">
              <label className="text-base font-semibold">Extra View</label>
              <div className=" md:w-[80%]">
                <UploadImgArea
                  name="extra"
                  imageURL={productImageState.extra?.imageUrl}
                />
              </div>
            </div>
            <hr />
          </div>
        </>
      ) : (
        <PageLoader />
      )}
    </div>
  );
};

export default UploadProductImages;
