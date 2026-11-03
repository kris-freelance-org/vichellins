"use client";

import React from "react";
import TabsBox from "@/components/account/TabBox";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { getCartItems } from "@/lib/redux/slices/cart/cartThunk";
import TopNavbar from "@/components/shared/TopNavbar";
import NavbarMobile from "@/components/shared/NavbarMobile";
import Footer from "@/components/shared/Footer";
import AuthGuard from "../admin/AuthGuard";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { userProfile } = useSelector((store: RootState) => store.auth);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const getData = async () => {
      try {
        if (userProfile) {
          await dispatch(getCartItems());
        }
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [dispatch, userProfile]);

  return (
    <AuthGuard>
      <div className="hidden md:block">
        <TopNavbar />
      </div>

      <div className="md:hidden">
        <NavbarMobile />
      </div>

      <div className="w-frame">
        <TabsBox tabs={tabList} />
        {children}
      </div>
      <div className="mt-[10rem]">
        <Footer />
      </div>
    </AuthGuard>
  );
};

export default Layout;

const tabList = [
  {
    name: "Profile",
    link: "/account",
  },
  {
    name: "Orders",
    link: "/account/orders",
  },
  {
    name: "Wishlist",
    link: "/account/wishlist",
  },
  {
    name: "Update Passwords",
    link: "/account/update-password",
  },
];
