"use client";

import { FC, useState } from "react";
import { Input } from "../ui/Input";
import { IUserPassword } from "../../types/users";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../lib/redux/store";
import { changeUserPassword } from "../../lib/redux/slices/auth/authThunk";
import { toast } from "../../hooks/useToast";
import { AxiosError } from "axios";
import { Button } from "../ui/Button";
import { useRouter } from "next/navigation";

const UserPasswordForm: FC = () => {
  const [passwordChangeDetails, setPasswordChangeDetails] =
    useState<IUserPassword>({
      password: "",
      passwordConfirmation: "",
    });

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setPasswordChangeDetails({ ...passwordChangeDetails, [name]: value });
  };

  const handleChangePassword = async () => {
    setIsLoading(true);
    try {
      if (
        !passwordChangeDetails.password ||
        !passwordChangeDetails.passwordConfirmation
      ) {
        const res = await dispatch(changeUserPassword(passwordChangeDetails));
        if (res.type.includes("rejected"))
          return toast({
            title: "An Error Occurred",
            description: res.payload as string,
            variant: "destructive",
          });

        return toast({
          title: "Invlid Input",
          description: "You haved not entered all fields",
          variant: "destructive",
        });
      }

      const res = await dispatch(changeUserPassword(passwordChangeDetails));

      if (res.type.includes("rejected"))
        return toast({
          title: "An Error Occurred",
          description: res.payload as string,
          variant: "destructive",
        });
      toast({
        title: "Password Change Successful",
        description: "You have Changed your Password successfully",
        variant: "success",
      });

      navigate.back();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400 || error.response?.status === 401) {
          return toast({
            title: "Error Changing Password",
            description: error.response?.data,
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Error Login in",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="space-y-6 py-12 text-base border-t border-b font-medium">
      <div className="grid items-center gap-3 md:grid-cols-[1fr_2fr]">
        <label htmlFor="">New Password</label>

        <Input
          value={passwordChangeDetails.password}
          onChange={handleInputChange}
          name="password"
          type="password"
          placeholder="**********"
          className=" focus-visible:ring-0 focus-visible:ring-offset-0 md:w-[70%]"
        />
      </div>
      <hr />
      <div className="grid items-center gap-3 md:grid-cols-[1fr_2fr]">
        <label htmlFor="">Confirm Password</label>
        <div className="grid gap-2">
          <Input
            value={passwordChangeDetails.passwordConfirmation}
            onChange={handleInputChange}
            name="passwordConfirmation"
            type="password"
            placeholder="**********"
            className=" focus-visible:ring-0 focus-visible:ring-offset-0 md:w-[70%]"
          />
          {passwordChangeDetails.password !=
            passwordChangeDetails.passwordConfirmation && (
            <span className="text-rose-500">Passwords do not match </span>
          )}
          {passwordChangeDetails.password &&
            passwordChangeDetails.passwordConfirmation &&
            passwordChangeDetails.password ==
              passwordChangeDetails.passwordConfirmation && (
              <span className="text-emerald-500">Passwords match </span>
            )}
        </div>
      </div>

      <div className="flex justify-end ">
        <div className="flex gap-4 ">
          <Button onClick={handleChangePassword} isLoading={isLoading}>
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserPasswordForm;
