"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { getCartItems } from "@/lib/redux/slices/cart/cartThunk";
import TopNavbar from "@/components/shared/TopNavbar";
import NavbarMobile from "@/components/shared/NavbarMobile";
import Footer from "@/components/shared/Footer";

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
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
    <div>
      <>
        <div className="hidden md:block">
          <TopNavbar />
        </div>

        <div className="md:hidden">
          <NavbarMobile />
        </div>

        {children}

        <div className="mt-[10rem]">
          <Footer />
        </div>
      </>
    </div>
  );
};

export default BaseLayout;
