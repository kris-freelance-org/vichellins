import RegisterForm from "@/components/auth/molecules/RegisterForm";
import { FC } from "react";

// interface RegisterProps {}
const Register: FC = () => {
  return (
    <div className="py-[4rem] px-8 w-screen flex items-center  bg-white">
      <div className=" mx-auto w-full xl:w-[35%] space-y-12">
        <div className="flex flex-col  items-center ">
          <h6 className="font-bold text-[3rem] font-manjari mb-[1rem]">
            Register
          </h6>
          <p className="font-normal text-center lg:text-left text-[#344054] text-[1.6rem]">
            Provide details and Register to create your account
          </p>
        </div>
        <div className=" py-16 px-8 rounded-xl border border-brandYellow">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
