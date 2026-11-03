import { Button } from "@/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/useToast";
import {
  deleteCategory,
  getAllCategories,
} from "@/lib/redux/slices/category/categoryThunk";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { AxiosError } from "axios";
import { FC, useState } from "react";
import { SlOptionsVertical } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";
import { NewCategoryDialog } from "./NewCategoryDialog";
import { DeleteCategoryDialog } from "../DeleteCategoryModal";

interface CategoryTablePopoverProps {
  selectedId: string | null;
}
const CategoryTablePopover: FC<CategoryTablePopoverProps> = ({
  selectedId,
}) => {
  const { isLoading } = useSelector((store: RootState) => store.categories);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleDeleteCategory = async () => {
    if (!selectedId) return null;

    try {
      const res = await dispatch(deleteCategory(selectedId));
      if (res.type.includes("rejected")) {
        toast({
          title: "An Error Occurred",
          description: res.payload as string,
          variant: "destructive",
        });
        return null;
      }

      await dispatch(getAllCategories());

      toast({
        title: "Category Deleted",
        variant: "success",
      });
      setOpen(false);
      return null;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400 || error.response?.status === 401) {
          toast({
            title: "Error Deleting Category",
            description: error.response?.data,
            variant: "destructive",
          });
          return null;
        }
      }

      toast({
        title: "Error Deleting Category",
        description: "Something went wrong",
        variant: "destructive",
      });
      return null;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
        <div className="flex flex-col text-base ">
          <NewCategoryDialog selectedId={selectedId} />

          <DeleteCategoryDialog
            isLoading={isLoading}
            handleDeleteCategory={handleDeleteCategory}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CategoryTablePopover;
