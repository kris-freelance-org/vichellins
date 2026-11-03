"use client";

import { useContext, useEffect, useState } from "react";

import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { cn } from "@/lib/utils";
import { updateProductStateValues } from "@/lib/redux/slices/products/productSlice";
import {
  getSingleProduct,
  updateProduct,
} from "@/lib/redux/slices/products/productThunk";
import { toast } from "@/hooks/useToast";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/Button";
import UploadImgArea from "@/components/admin_products/molecules/UploadImgArea";
import PageLoader from "@/components/shared/PageLoader";
import { useRouter } from "next/navigation";
import { ProductFileContext } from "@/context/productFile";

const UploadProductImages = () => {
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
            imageUrl: selectedProductAdmin.mainImage,
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
        postData.append("mainImage", productImageState.main?.image);
      }
      if (productImageState.left?.image) {
        postData.append("leftImage", productImageState.left?.image);
      }
      if (productImageState.right?.image) {
        postData.append("rightImage", productImageState.right?.image);
      }
      if (productImageState.extra?.image) {
        postData.append("extraImage", productImageState.extra?.image);
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

      updateProductImageState({
        type: "update",
        payload: {
          main: null,
          right: null,
          left: null,
          extra: null,
        },
      });

      return toast({
        title: "Product Image Uploaded ",
        description: "The Product Image was Uploaded successfully",
        variant: "success",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400 || error.response?.status === 401) {
          return toast({
            title: "Erroor Adding Product",
            description: error.response?.data,
            variant: "destructive",
          });
        }
      }
      return toast({
        title: "Erroor Adding Product",
        description: "Something Went Wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8  p-8 bg-white">
      {!isPageLoading ? (
        <>
          <div className={cn("grid justify-between", "grid-cols-2")}>
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
              <Button onClick={handleUploadProductImages} isLoading={isLoading}>
                Save
              </Button>
            </div>
          </div>

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
