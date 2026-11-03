"use client";

import { Button } from "@/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/useToast";
import {
  deleteProduct,
  getAllProducts,
} from "@/lib/redux/slices/products/productThunk";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { AxiosError } from "axios";

import { Eye } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { SlOptionsVertical } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";
// import { UpdateProductStock } from "./UpdateProductStock";
import { DeleteProductDialog } from "./DeleteProductDialog";

interface ProductsTablePopoverProps {
  selectedId: string | null;
  productName: string;
}
const ProductsTablePopover: FC<ProductsTablePopoverProps> = ({
  selectedId,
}) => {
  const { isLoading } = useSelector((store: RootState) => store.categories);
  const dispatch = useDispatch<AppDispatch>();

  const handleDeleteProduct = async () => {
    if (!selectedId) return null;

    try {
      const res = await dispatch(deleteProduct(selectedId));
      if (res.type.includes("rejected")) {
        toast({
          title: "An Error Occurred",
          description: res.payload as string,
          variant: "destructive",
        });

        return null;
      }

      await dispatch(getAllProducts());

      toast({
        title: "Product has been Deleted",
        variant: "success",
      });

      return null;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400 || error.response?.status === 401) {
          toast({
            title: "Error Deleting Product",
            description: error.response?.data,
            variant: "destructive",
          });

          return null;
        }
      }

      toast({
        title: "Error Deleting Product",
        description: "Something went wrong",
        variant: "destructive",
      });
      return null;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost">
          <SlOptionsVertical />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        avoidCollisions
        side="right"
        className="w-fit p-8 bg-white text-base rounded-2xl shadow-lg"
      >
        <div className="flex flex-col gap-4 text-base ">
          <Link
            href={`/admin/products/${selectedId}`}
            className="flex gap-3 hover:bg-accent p-2  font-medium items-center justify-start "
          >
            <Eye size={16} />
            View Product
          </Link>

          {/* <UpdateProductStock
            productName={productName}
            selectedId={selectedId}
          /> */}

          <DeleteProductDialog
            isLoading={isLoading}
            handleDeleteProduct={handleDeleteProduct}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProductsTablePopover;
