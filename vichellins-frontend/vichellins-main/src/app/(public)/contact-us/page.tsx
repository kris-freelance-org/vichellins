import Brand from "@/components/shared/atom/Brand";
import Image from "next/image";
import { FC } from "react";

const ContactUsPage: FC = () => {
  return (
    <div className=" grid grid-cols-[1fr_1fr] h-screen">
      <div className=" pl-[8rem] space-y-[6rem] bg-white bg-[url('/images/vichellins_logo_trans.png')] bg-cover bg-no-repeat bg-center">
        <Brand />

        <div className="space-y-[2rem]">
          <h4 className="text-[4rem] font-extrabold">Welcome to Vichellins</h4>

          <div className="flex gap-[3rem] items-center">
            <Image
              width={60}
              height={60}
              alt="whats-logo
"
              src={"/images/whatsapp-logo.png"}
              className="w-[4.6rem] h-[4.6rem]"
            />
            <div className="">
              <p className="text-[2rem] font-light">
                Reach out to us on Whatsapp
              </p>
              <h6 className="font-semibold text-[3rem]">+234 70 324 6890</h6>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[url('/images/contact-bg.png')] "></div>
    </div>
  );
};

export default ContactUsPage;
