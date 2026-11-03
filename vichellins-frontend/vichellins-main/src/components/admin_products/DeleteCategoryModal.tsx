import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FC, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Trash2 } from "lucide-react";

type IDeleteFunc = () => Promise<null>;

interface DeleteCategoryDialogProps {
  handleDeleteCategory: IDeleteFunc;
  isLoading: boolean;
}

export const DeleteCategoryDialog: FC<DeleteCategoryDialogProps> = ({
  handleDeleteCategory,
  isLoading,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({
            className:
              "items-center p-2 h-fit justify-start gap-3   text-rose-500  hover:text-rose-600  ",
            variant: "ghost",
          })
        )}
      >
        <Trash2 size={16} />
        Remove Category
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle></DialogTitle>
        <div className="space-y-12">
          <h5 className="text-2xl font-semibold">
            Delete Category Confirmation
          </h5>
          <div className="flex justify-between items-center p-2 border rounded-xl">
            Do you want to delete this category ?
          </div>
          <div className="flex justify-end">
            <Button isLoading={isLoading} onClick={handleDeleteCategory}>
              Proceed
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
