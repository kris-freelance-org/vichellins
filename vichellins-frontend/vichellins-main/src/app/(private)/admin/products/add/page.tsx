"use client";

import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AxiosError } from "axios";
import { addProduct } from "@/lib/redux/slices/products/productThunk";
import { IAddProduct } from "@/types/products";
import { Button } from "@/components/ui/Button";
import ProductForm from "@/components/admin_products/ProductForm";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { toast } from "@/hooks/useToast";
import { ProductFileContext } from "@/context/productFile";

const initData = {
  name: "",
  categoryId: "",
  price: "",
  stock: "",
  description: "",
};

const AddProduct = () => {
  const [productInfo, setProductInfo] = useState<IAddProduct>(initData);
  const { isLoading } = useSelector((store: RootState) => store.products);

  const dispatch = useDispatch<AppDispatch>();

  const productImageContext = useContext(ProductFileContext);
  if (!productImageContext) {
    throw new Error("ProductFileContext is undefined");
  }
  const { productImageState } = productImageContext;

  const navigate = useRouter();

  const handleAddProduct = async () => {
    try {
      if (
        !productInfo.categoryId ||
        !productInfo.name ||
        !productInfo.description ||
        !productInfo.price ||
        !productImageState.main?.image
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
      postData.append("stock", productInfo.stock);

      postData.append("mainImage", productImageState.main?.image);

      if (productImageState.right?.image) {
        postData.append("rightImage", productImageState.right?.image);
      }
      if (productImageState.left?.image) {
        postData.append("leftImage", productImageState.left?.image);
      }
      if (productImageState.extra?.image) {
        postData.append("extraImage", productImageState.extra?.image);
      }

      //   Upload Product Information
      const resInfo = await dispatch(addProduct(postData));
      if (resInfo.type.includes("rejected")) {
        return toast({
          title: "An Error Occurred",
          description: resInfo.payload as string,

          variant: "destructive",
        });
      }

      setProductInfo(initData);

      navigate.push('/admin/products')
      return toast({
        title: "Product Added successfully",
        description: "A New Product has been  Added ",
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
    }
  };

  return (
    <div className="space-y-8  p-8 bg-white">
      <div className="flex justify-between ">
        <div className="flex gap-3 ">
          <Button
            variant={"ghost"}
            className="p-0 m-0"
            onClick={() => navigate.back()}
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex flex-col mb-8">
            <h5 className="text-[#3F434A] text-2xl font-manjari font-bold">
              Add New Product
            </h5>

            <span className="font-normal text-base">
              Supply details to add Product
            </span>
          </div>
        </div>
        <div className="flex gap-4 ">
          <Button onClick={handleAddProduct} isLoading={isLoading}>
            Add Product
          </Button>
        </div>
      </div>
      <ProductForm productInfo={productInfo} setProductInfo={setProductInfo} />
    </div>
  );
};

export default AddProduct;
