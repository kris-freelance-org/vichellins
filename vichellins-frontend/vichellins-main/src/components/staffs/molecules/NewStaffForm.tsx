import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/useToast";
import { updateStaffStateValues } from "@/lib/redux/slices/staff/staffSlice";
import {
  createStaff,
  getAllStaffs,
  getSingleStaff,
} from "@/lib/redux/slices/staff/staffThunk";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { AxiosError } from "axios";
import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface NewStaffFormProps {
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  selectedId?: string | null;
}
const NewStaffForm: FC<NewStaffFormProps> = ({ setIsOpen, selectedId }) => {
  const [newStaffInput, setNewStaffInput] = useState<{
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
  }>({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
  });
  const { selectedStaff, isLoading } = useSelector(
    (store: RootState) => store.staff
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getData = () => {
      dispatch(
        updateStaffStateValues({
          name: "selectedStaff",
          value: null,
        })
      );
      if (!selectedId) return;
      try {
        dispatch(getSingleStaff(selectedId));
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [dispatch, selectedId]);

  useEffect(() => {
    if (selectedStaff) {
      setNewStaffInput({
        name: selectedStaff.name,
        email: selectedStaff.name,
        phone: selectedStaff.phone,
        role: selectedStaff.role,
        password: "",
      });
    }
  }, [selectedStaff]);

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setNewStaffInput({ ...newStaffInput, [name]: value });
  };

  const handleNewStaff = async () => {
    try {
      if (!newStaffInput.name || !newStaffInput.email) {
        return toast({
          title: "Invalid Input",
          description: "Please provide all Fields",
          variant: "destructive",
        });
      }

      //   Upload Category Information
      const resInfo = await dispatch(createStaff(newStaffInput));
      if (resInfo.type.includes("rejected")) {
        return toast({
          title: "An Error Occurred",
          description: resInfo.payload as string,

          variant: "destructive",
        });
      }

      await dispatch(getAllStaffs());

      if (setIsOpen) {
        setIsOpen(false);
      }

      setNewStaffInput({
        name: "",
        email: "",
        password: "",
        role: "",
        phone: "",
      });

      return toast({
        title: "Staff Added",
        variant: "success",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400 || error.response?.status === 401) {
          return toast({
            title: "Error Adding Staff",
            description: error.response?.data,
            variant: "destructive",
          });
        }
      }
      return toast({
        title: "Error Adding Staff",
        description: "Something Went Wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        <label className="font-bold text-base" htmlFor="name">
          Full Name
        </label>
        <Input
          name="name"
          value={newStaffInput.name}
          placeholder="Full Name"
          onChange={handleOnchange}
        />
      </div>
      <div className="space-y-4">
        <label className="font-bold text-base" htmlFor="email">
          Email
        </label>
        <Input
          name="email"
          value={newStaffInput.email}
          placeholder="Email"
          onChange={handleOnchange}
        />
      </div>
      <div className="space-y-4">
        <label className="font-bold text-base" htmlFor="phone">
          Phone
        </label>
        <Input
          name="phone"
          value={newStaffInput.phone}
          placeholder="Phone"
          onChange={handleOnchange}
        />
      </div>
      <div className="space-y-4">
        <label className="font-bold text-base" htmlFor="role">
          Role
        </label>
        <Select value={newStaffInput.role} onValueChange={(val) => setNewStaffInput({...newStaffInput, role: val})}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Super Admin">Super Admin</SelectItem>
            <SelectItem value="Manager">Maanager</SelectItem>
            <SelectItem value="Staff">Staff</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        <label className="font-bold text-base" htmlFor="password">
          Password
        </label>
        <Input
          name="password"
          type="password"
          value={newStaffInput.password}
          placeholder="Password"
          onChange={handleOnchange}
        />
      </div>

      <div className="flex justify-end">
        <Button isLoading={isLoading} onClick={handleNewStaff}>
          Create
        </Button>
      </div>
    </div>
  );
};

export default NewStaffForm;
