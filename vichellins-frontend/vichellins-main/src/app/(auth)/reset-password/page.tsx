
"use client"

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "@/hooks/useToast";
import { resetPassword } from "@/lib/redux/slices/auth/authThunk";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
// import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch, useSelector } from "react-redux";

const ResetPassword: FC = () => {
  const { otp } = useSelector((store: RootState) => store.auth);
  // const [noCaptcha, setNoCaptcha] = useState(true);
  const [passwordInput, setPasswordInput] = useState({
    password: "",
    otp: otp,
    password_confirmation: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setPasswordInput({ ...passwordInput, [name]: value });
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (!passwordInput.password || !passwordInput.password_confirmation) {
        return toast({
          title: "Incomplete Details",
          description: "Please enter all Fields",
          variant: "destructive",
        });
      }
      if (passwordInput.password !== passwordInput.password_confirmation) {
        return toast({
          title: "Your Password do not Match",
          description: "Please Ensure your Passwords Match ",
          variant: "destructive",
        });
      }

      const res = await dispatch(resetPassword(passwordInput));
      if (res.type.includes("rejected"))
        return toast({
          title: "An Error Occurred",
          description: res.payload as string,
          variant: "destructive",
        });

      router.push("/login");
      return toast({
        title: "Password Reset Successful",
        description: "You have successfully reset your password",
        variant: "success",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400 || error.response?.status === 401) {
          return toast({
            title: "Error Reseting Password",
            description: error.response?.data,
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Error Reseting Password",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-[4rem] px-8 w-screen flex items-center  bg-white">
      <div className=" mx-auto w-full xl:w-[30%] space-y-12">
        <div className="flex flex-col items-center ">
          <h6 className="font-bold text-[3rem] font-manjari mb-[1rem]">
            Reset Password
          </h6>
          <p className="font-normal flex justify-center text-center lg:text-left text-[#344054] text-[1.6rem]">
            Welcome back! Enter your new password
          </p>
        </div>
        <form
          onSubmit={handleResetPassword}
          className=" py-16 px-8 rounded-xl border border-brandYellow"
        >
          <div className="space-y-10">
            <div className="space-y-4">
              <label htmlFor="name" className="font-bold text-base">
                Password
              </label>
              <Input
                name="password"
                value={passwordInput.password}
                onChange={handleOnchange}
                type="password"
                placeholder="*************"
                className="bg-white"
              />
            </div>
            <div className="space-y-4">
              <label htmlFor="name" className="font-bold text-base">
                Password Confirmation
              </label>
              <Input
                name="password_confirmation"
                value={passwordInput.password_confirmation}
                onChange={handleOnchange}
                type="password"
                placeholder="*************"
                className="bg-white"
              />
            </div>
            {/* <div className="grid place-content-center">
              <ReCAPTCHA
                className="w-full text-sm"
                sitekey={process.env.VITE_RECAPTCHA_SITE_KEY as string}
                onChange={() => setNoCaptcha(false)}
              />
            </div> */}

            <Button
              disabled={isLoading}
              className="w-full"
              isLoading={isLoading}
              type="submit"
            >
              Request Reset
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
