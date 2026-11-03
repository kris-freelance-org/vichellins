"use client"

import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AxiosError } from "axios";
import {
  getSingleProduct,
  updateProduct,
} from "@/lib/redux/slices/products/productThunk";
import { IAddProduct } from "@/types/products";
import { Button } from "@/components/ui/Button";
import ProductForm from "@/components/admin_products/ProductForm";
import { ArrowLeft } from "lucide-react";
import PageLoader from "@/components/shared/PageLoader";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/hooks/useToast";


const UpdateProduct: FC = () => {
  const [isPageLoading, setPageIsLoading] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [productInfo, setProductInfo] = useState<IAddProduct>({
    name: "",
    categoryId: "",
    price: "",
    stock: "",
    description: "",
  });
  const { selectedProductAdmin, isLoading } = useSelector(
    (store: RootState) => store.products
  );

  const { productId } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      if (!productId) return;
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
      setProductInfo({
        name: selectedProductAdmin?.name || "",
        categoryId: selectedProductAdmin?.categoryId || "",
        price: selectedProductAdmin?.price?.toString() || "",
        stock: selectedProductAdmin?.stock?.toString() || "",
        description: selectedProductAdmin?.description || "",
      });
    }
  }, [selectedProductAdmin]);

  const handleUpdateProduct = async () => {
    if (!selectedProductAdmin)
      return toast({
        title: "No Product Selected",
        description: "Something Wrong Wrong",
        variant: "destructive",
      });
    try {
      if (
        !productInfo.categoryId ||
        !productInfo.name ||
        !productInfo.description ||
        !productInfo.price
      ) {
        return toast({
          title: "Invlid Input",
          description: "You haved not entered all fields",
          variant: "destructive",
        });
      }

       const postData = new FormData();

      postData.append("name", productInfo.name);
      postData.append("price", productInfo.price);
      postData.append("categoryId", productInfo.categoryId);
      postData.append("description", productInfo.description);
      if (selectedProductAdmin?.mainImage) {
        postData.append("mainImage", selectedProductAdmin?.mainImage);
      }

      if (selectedProductAdmin?.rightImage) {
        postData.append("rightImage", selectedProductAdmin?.rightImage);
      }
      if (selectedProductAdmin?.leftImage) {
        postData.append("leftImage", selectedProductAdmin?.leftImage);
      }

      if (selectedProductAdmin?.extraImage) {
        postData.append("extraImage", selectedProductAdmin?.extraImage);
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
        title: "Product Updated successfully",
        description: "The Product Details was updated successfully",
        variant: "success",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400 || error.response?.status === 401) {
          return toast({
            title: "Error Updating Product",
            description: error.response?.data,
            variant: "destructive",
          });
        }
      }
      return toast({
        title: "Erroor Updating Product",
        description: "Something Went Wrong",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="space-y-8  p-8 bg-white">
      <div className="flex justify-between items-center ">
        <div className="flex gap-3">
          <Button
            variant={"ghost"}
            className="p-0 m-0"
            onClick={() => router.back()}
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex flex-col mb-8">
            <h5 className="text-[#3F434A] text-2xl font-manjari font-bold">
              {isEditingMode ? "Update Product" : " View Product"}
            </h5>
            <span className="font-normal text-base">
              {isEditingMode ? "Update" : " View"} Product Details Here
            </span>
          </div>
        </div>
        <div className="flex gap-4 ">
          {isEditingMode && (
            <Button onClick={() => setIsEditingMode(false)} variant={"outline"}>
              Cancel
            </Button>
          )}
          {isEditingMode && (
            <Button onClick={handleUpdateProduct} isLoading={isLoading}>
              Update Product
            </Button>
          )}
          {!isEditingMode && (
            <Button onClick={() => setIsEditingMode(true)}>Edit Product</Button>
          )}
        </div>
      </div>

      {!isPageLoading ? (
        <ProductForm
          productInfo={productInfo}
          setProductInfo={setProductInfo}
          readonly={!isEditingMode}
          productUpdateMode
        />
      ) : (
        <PageLoader />
      )}
    </div>
  );
};

export default UpdateProduct;
