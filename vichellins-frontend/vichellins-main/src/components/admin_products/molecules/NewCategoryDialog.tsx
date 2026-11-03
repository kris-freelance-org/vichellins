import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FC, useState } from "react";
import { buttonVariants } from "@/components/ui/Button";
import NewCategoryForm from "./NewCategoryForm";
import { Pen, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";

interface NewCategoryDialogProps {
  selectedId?: string | null;
}

export const NewCategoryDialog: FC<NewCategoryDialogProps> = ({
  selectedId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({
            className: "font-base w-full border-primary p-0",
            variant: !selectedId ? "outline" : "ghost",
          })
        )}
      >
        {!selectedId ? (
          <span className="flex gap-1 items-center p-4">
            <Plus />
            Add Category
          </span>
        ) : (
          <span className="justify-start flex items-center gap-3 p-2  w-full m-0">
            <Pen size={16} /> Edit Category
          </span>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle></DialogTitle>
        <div className="space-y-12">
          <h5 className="text-2xl font-semibold">
            {selectedId ? "Edit Category" : "Add New Category"}
          </h5>
          <NewCategoryForm selectedId={selectedId} setIsOpen={setIsOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
