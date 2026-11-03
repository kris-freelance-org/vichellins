import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { FC, useState } from "react";
  import { Button } from "@/components/ui/Button";

  import { Pen, Plus } from "lucide-react";
import NewStaffForm from "./NewStaffForm";
  
  interface NewStaffDialogProps {
    selectedId?: string | null;
  }
  
  export const NewStaffDialog: FC<NewStaffDialogProps> = ({
    selectedId,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogTrigger className="font-base">
          {!selectedId ? (
            <Button variant="outline" className="w-full border-primary">
              <Plus />
              Add Staff
            </Button>
          ) : (
            <Button
              className="justify-start flex gap-3 pl-0 w-full m-0"
              variant={"ghost"}
            >
              <Pen size={16} /> Edit Staff
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <div className="space-y-12">
            <h5 className="text-2xl font-semibold">Add New Staff</h5>
            <NewStaffForm selectedId={selectedId} setIsOpen={setIsOpen} />
          </div>
        </DialogContent>
        <DialogClose className="text-base" />
      </Dialog>
    );
  };
  