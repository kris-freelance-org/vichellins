import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FC, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/Button";
import { FilePenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "../ui/Input";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { updateProductStock } from "@/lib/redux/slices/products/productThunk";

interface UpdateProductStockProps {
  selectedId: string | null;
  productName: string
}

export const UpdateProductStock: FC<UpdateProductStockProps> = ({
  selectedId,productName
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading } = useSelector((store: RootState) => store.products);
  const [stock, setStock] = useState<number>(0);

  const dispatch = useDispatch<AppDispatch>();

  const handleUpdateProductStock = () => {
    if(!selectedId) return
    dispatch(
      updateProductStock({
        stockUpdates: [
          {
            productId: selectedId,
            newStock: stock,
          },
        ],
      })
    );
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({
            className: "items-center p-2 h-fit justify-start gap-3 ",
            variant: "ghost",
          })
        )}
      >
        <FilePenLine size={16} />
        Update Stock
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle></DialogTitle>
        <div className="space-y-12">
          <h5 className="text-2xl font-semibold">Update Product Stock</h5>
          <div className="flex text-[1.6rem] justify-between items-center p-4 border rounded-xl">
            <span>Name: </span>
            <span>{productName}</span>
          </div>
          <div className="flex flex-col gap-6">
            <Input
              value={stock}
              placeholder="Enter Category Name"
              onChange={(e) => setStock(Number(e.target.value))}
            />

            <div className="flex justify-end">
              <Button isLoading={isLoading} onClick={handleUpdateProductStock}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
     
    </Dialog>
  );
};
