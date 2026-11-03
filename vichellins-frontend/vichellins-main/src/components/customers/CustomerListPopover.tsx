import { FC, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";
import { Button } from "@/components/ui/Button";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { getAllCustomers } from "@/lib/redux/slices/customers/customerThunk";
import UserAvatar from "@/components/shared/atom/UserAvatar";
import CustomLoader from "@/components/shared/atom/CustomLoader";
import { Input } from "../ui/Input";
import { ICustomer } from "@/types/customers";

interface CustomerListPopoverProps {
  candidateUser: ICustomer | null;

  setCandidateUser: React.Dispatch<React.SetStateAction<ICustomer | null>>;
}

export const CustomerListPopover: FC<CustomerListPopoverProps> = ({
  candidateUser,
  setCandidateUser,
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const { customers, isLoading } = useSelector(
    (store: RootState) => store.customer
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getData = async () => {
      try {
        if (!customers) {
          await dispatch(getAllCustomers());
        }
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [customers, dispatch]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-full p-0 m-0 text-green-500 gap-4 justify-start h-fit "
        >
          {candidateUser ? (
            <div className="flex justify-between items-center  w-full">
              <div className="flex gap-3 items-center text-base">
                <UserAvatar
                  imgUrl={"/assets/images/user-profile.png"}
                  name="User"
                />
                <div className="flex flex-col items-start">
                  <h5 className="font-medium ">{candidateUser.name}</h5>
                  <span className="text-[#4D4C4C]">{candidateUser.email}</span>
                </div>
              </div>
              <span className="text-sm">Click to Change</span>
            </div>
          ) : (
            <Input placeholder="Click to Selected User" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        avoidCollisions
        side="bottom"
        className="w-[47.8rem] p-8 bg-white text-base rounded-2xl shadow-lg"
      >
        {isLoading ? (
          <div>
            <CustomLoader width={28} height={28} />
          </div>
        ) : (
          <Command className="">
            <CommandInput className="text-base" placeholder="Search" />
            <CommandList className="my-8">
              <CommandEmpty className="text-base text-center">
                No results found.
              </CommandEmpty>

              {customers &&
                customers.map((staff, index) => (
                  <React.Fragment key={index}>
                    <CommandItem
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setCandidateUser(staff);
                        setOpen(false);
                      }}
                    >
                      <div className="flex gap-3 items-center text-base">
                        <UserAvatar
                          imgUrl={"/assets/images/user-profile.png"}
                          name="User"
                        />
                        <div>
                          <h5 className="font-medium ">{staff.name}</h5>
                          <span className="text-[#4D4C4C]">{staff.email}</span>
                        </div>
                      </div>
                    </CommandItem>
                  </React.Fragment>
                ))}
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
};
