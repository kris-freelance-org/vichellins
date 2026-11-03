"use client";

import { useDispatch } from "react-redux";
import { Button, buttonVariants } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

import { Mail, MoveLeft } from "lucide-react";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/lib/redux/store";
import Link from "next/link";

import { saveOtp } from "@/lib/redux/slices/auth/authSlice";
import { toast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";

// interface EnterOTPProps {}
const EnterOTP: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [otp, setOtp] = useState({
    value1: "",
    value2: "",
    value3: "",
    value4: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setOtp({ ...otp, [name]: value });
  };

  const handleSaveOtp = () => {
    if (!otp.value1 || !otp.value2 || !otp.value3 || !otp.value4) {
      return toast({
        title: "Invalid Otp",
        description: "Please enter all Fields with a valid Otp",
        variant: "destructive",
      });
    }

    dispatch(saveOtp(`${otp.value1}${otp.value2}${otp.value3}${otp.value4}`));

    router.push("/reset-password");
  };

  return (
    <div className="py-[4rem] px-8 w-screen flex items-center  bg-white">
      <div className=" mx-auto w-full xl:w-[30%] ">
        <div className="flex flex-col gap-6 items-center">
          <div className="bg-[#D4EBE2] mx-auto w-fit h-fit rounded-full border-[#EAF9EC] border-[1rem] p-4">
            <Mail className="w-[2.8rem] h-[2.8rem]" />
          </div>
          <h6 className="font-bold text-[3rem] font-manjari ">
            Check your Email
          </h6>
          <p className="font-normal text-center text-[#344054] text-[1.6rem]">
            We have just sent you an OTP.
          </p>

          <div className="flex gap-4 mb-4">
            <Input
              onChange={handleChange}
              name="value1"
              value={otp.value1}
              className="w-[8rem] font-semibold text-primary text-[4rem]"
            />
            <Input
              onChange={handleChange}
              name="value2"
              value={otp.value2}
              className="w-[8rem] font-semibold text-primary text-[4rem]"
            />
            <Input
              onChange={handleChange}
              name="value3"
              value={otp.value3}
              className="w-[8rem] font-semibold text-primary text-[4rem]"
            />
            <Input
              onChange={handleChange}
              name="value4"
              value={otp.value4}
              className="w-[8rem] font-semibold text-primary text-[4rem]"
            />
          </div>

          <Button
            onClick={handleSaveOtp}
            size={"lg"}
            className="rounded-xl w-full"
          >
            Very Email
          </Button>
          <Link
            href={"/login"}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "text-[#667085] gap-2"
            )}
          >
            <MoveLeft />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EnterOTP;
