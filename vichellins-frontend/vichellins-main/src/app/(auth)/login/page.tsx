"use client"

import LoginForm from "@/components/auth/molecules/LoginForm";
import { setShowLoginModal } from "@/lib/redux/slices/auth/authSlice";
import routes from "@/lib/routes";
import Link from "next/link";
import { FC, useEffect } from "react";
import { useDispatch } from "react-redux";

// interface LoginProps {}
const Login: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setShowLoginModal(true));
  }, [dispatch]);

  return (
    <div className="py-[4rem] px-8 w-screen flex items-center  bg-white">
      <div className=" mx-auto w-full xl:w-[35%] space-y-12">
        <div className="flex flex-col  items-center ">
          <h6 className="font-bold text-[3rem] font-manjari mb-[1rem]">
            Login
          </h6>
          <p className="font-normal text-center lg:text-left text-[#344054] text-[1.6rem]">
            Welcome back! Please enter your details.
          </p>
        </div>
        <div className=" py-16 px-8 rounded-xl border border-brandYellow">
          <LoginForm type="customer" />
        </div>

        <div className="fixed left-0 right-0 p-4 bottom-0 flex justify-end text-[1.2rem] bg-secondary text-primary ">
          <Link href={routes.loginAsStaff} className="font-normal "> Login as Admin</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
