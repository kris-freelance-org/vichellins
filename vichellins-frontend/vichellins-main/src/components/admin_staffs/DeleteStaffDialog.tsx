import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FC, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Trash2 } from "lucide-react";

type IDeleteFunc = (staffId: number) => Promise<null>;

interface DeleteStaffDialogProps {
  handleDeleteStaff: IDeleteFunc;
  isLoading: boolean;
  staffId: number;
}

export const DeleteStaffDialog: FC<DeleteStaffDialogProps> = ({
  handleDeleteStaff,
  isLoading,
  staffId,
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
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle></DialogTitle>
        <div className="space-y-12">
          <h5 className="text-2xl font-semibold">Delete Staff Confirmation</h5>
          <div className="flex justify-between items-center p-2 text-rose-500 text-[1.4rem]">
            Do you want to delete this Staff Account ?
          </div>
          <div className="flex justify-end">
            <Button
              isLoading={isLoading}
              onClick={() => handleDeleteStaff(staffId)}
            >
              Proceed
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
