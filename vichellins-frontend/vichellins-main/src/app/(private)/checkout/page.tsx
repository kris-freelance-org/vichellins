"use client";

import OrderSummary from "@/components/cart/OrderSummary";
import Footer from "@/components/shared/Footer";
import NavbarMobile from "@/components/shared/NavbarMobile";
import TopNavbar from "@/components/shared/TopNavbar";
import { buttonVariants } from "@/components/ui/Button";
import { RootState } from "@/lib/redux/store";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { useSelector } from "react-redux";

// interface CheckoutProps {}
const Checkout: FC = () => {
  const { cartItems, cartTotal } = useSelector(
    (store: RootState) => store.cart
  );
  return (
    <>
      <div className="hidden md:block">
        <TopNavbar />
      </div>

      <div className="md:hidden">
        <NavbarMobile />
      </div>
      <div className="w-frame mt-8 ">
        <div className="lg:w-[50%] mx-auto space-y-[3rem]">
          <h3 className="font-bold text-[3rem] text-center">
            Thank you for using Vichellin&apos;s
          </h3>

          <p className="text-[1.6rem] font-medium text-center lg:w-[70%] mx-auto">
            Your security and trust is our utmost concern. Complete your
            purchase on Whatsapp to get a closer inspection of your gadgets
          </p>

          <div className="space-y-[2rem]">
            <p className="text-[1.6rem] font-medium text-center">
              Our agent will attend to you to complete your order shortly
            </p>
            <div className=" bg-[#FEEDCA1A]  grid place-content-center border border-[#CA8A004D]">
              <div className="flex items-center p-4 gap-[1rem] w-fit ">
                <Image
                  width={100}
                  height={100}
                  alt="whatsapp-logo"
                  className="w-[4rem] h-[4rem]"
                  src={"/images/whatsapp-logo.png"}
                />
                <div className="text-[#CA8A00]">
                  <p className="text-[1.6rem] font-normal">
                    Reach out on Whatsapp.
                  </p>
                  <h6 className="text-[2.4rem] font-semibold">
                    +234 70 324 6890
                  </h6>
                </div>
              </div>
            </div>

            <div className="w-fit mx-auto">
              <OrderSummary hideBtn items={cartItems} total={cartTotal} />
              <Link
                href="https://chat.whatsapp.com/+234 70 324 6890"
                className={cn(buttonVariants({
                  className: "gap-[1rem] mt-[1rem]"
                }))}
              >
                <Image
                  src="/images/whatsapp-logo.png"
                  alt="Whatsapp logo"
                  className="w-full h-full"
                  height={50}
                  width={50}
                />
                Reach out on whatsapp
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[10rem]">
        <Footer />
      </div>
    </>
  );
};

export default Checkout;
