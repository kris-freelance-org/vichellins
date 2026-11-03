"use client";

import PageLoader from "@/components/shared/PageLoader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "@/hooks/useToast";
import {
  getAdminProfile,
  updateAdminProfileDetails,
} from "@/lib/redux/slices/auth/authThunk";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { IAddStaff } from "@/types/staff";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Profile = () => {
  const [userInput, setUserInput] = useState<IAddStaff>({
    name: "",
    email: "",
    phone: "",
    role: "",
  });
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const { adminProfile } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getData = async () => {
      await dispatch(getAdminProfile());
    };
    getData();
  }, []);

  useEffect(() => {
    if (adminProfile && session) {
      setUserInput({
        name: adminProfile.name || "",
        email: adminProfile.email || "",
        phone: adminProfile.phone || "",
        role: adminProfile.role || "",
      });
    }
  }, [adminProfile, session]);

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setUserInput({ ...userInput, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      if (!session?.user?.email || !session?.user?.name) {
        return toast({
          title: "Invlid Input",
          description: "You haved not entered all fields",
          variant: "destructive",
        });
      }

      const res = await dispatch(updateAdminProfileDetails(userInput));

      // await update(res.payload);
      if (res.type.includes("rejected"))
        return toast({
          title: "An Error Occurred",
          description: res.payload as string,
          variant: "destructive",
        });

      if (typeof res.payload != "string") {
        const updatedUser = res.payload?.user;
        await update({
          name: updatedUser.user.name,
          email: updatedUser.user.email,
          phone: updatedUser.user.phone,
          role: updatedUser.user.role,
          id: updatedUser.user.id,
        });
      }

      toast({
        title: "Profile Update Success",
        description: "You have Updated your profile successfully",
        variant: "success",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400 || error.response?.status === 401) {
          return toast({
            title: "Error Signing Up",
            description: error.response?.data,
            variant: "destructive",
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-xl border space-y-12">
      <div className="flex flex-col mb-8">
        <h5 className="text-[#3F434A] text-2xl font-manjari font-bold">
          Profile
        </h5>
        <span className="font-normal text-base">
          Your account information is here
        </span>
      </div>

      {adminProfile ? (
        <div className="space-y-8">
          <div className="space-y-4">
            <label htmlFor="name" className="font-bold text-base">
              Name
            </label>
            <Input
              name="name"
              value={userInput.name}
              onChange={handleOnchange}
              placeholder="John Doe"
              className="bg-white"
            />
          </div>
          <div className="space-y-4">
            <label htmlFor="name" className="font-bold text-base">
              Email
            </label>
            <Input
              name="email"
              value={userInput.email}
              onChange={handleOnchange}
              type="email"
              placeholder="name@mail.com"
              className="bg-white"
            />
          </div>
          <div className="space-y-4">
            <label htmlFor="phone" className="font-bold text-base">
              Phone
            </label>
            <Input
              name="phone"
              value={userInput.phone}
              onChange={handleOnchange}
              type="phone"
              placeholder="+2340000000"
              className="bg-white"
            />
          </div>
          <div className="space-y-4">
            <label htmlFor="role" className="font-bold text-base">
              Role
            </label>
            <Input
              name="role"
              value={userInput.role}
              onChange={handleOnchange}
              type="role"
              placeholder="+2340000000"
              className="bg-white"
            />
          </div>

          <Button
            className="w-full"
            disabled={isLoading}
            isLoading={isLoading}
            onClick={handleUpdate}
          >
            Update
          </Button>
        </div>
      ) : (
        <PageLoader />
      )}
    </div>
  );
};

export default Profile;
