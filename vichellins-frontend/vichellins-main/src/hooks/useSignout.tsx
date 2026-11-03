"use client"

import { logout } from "@/lib/redux/slices/auth/authSlice";
import { AppDispatch } from "@/lib/redux/store";
import { signOut } from "next-auth/react";
import { useDispatch } from "react-redux";

const useSignout = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleSignout = async () => {
    await signOut({ redirect: false });
    dispatch(logout());

    window.location.href = '/login';
  };

  return handleSignout;
};

export default useSignout;
