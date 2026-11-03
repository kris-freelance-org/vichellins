"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "@/hooks/useToast";
import { register } from "@/lib/redux/slices/auth/authThunk";
import { AppDispatch } from "@/lib/redux/store";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch } from "react-redux";

const RegisterForm = () => {
  const [userInput, setUserInput] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // const [noCaptcha, setNoCaptcha] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useRouter();

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setUserInput({ ...userInput, [name]: value });
  };

  const handleRegister = async () => {
    if (!userInput.email || !userInput.password) {
      return toast({
        title: "Invalid Input",
        description: "Please Enter All Fields",
        variant: "destructive",
      });
    }
    setIsLoading(true);

    try {
      const res = await dispatch(
        register({
          name: userInput.name,
          phone: userInput.phone,
          email: userInput.email,
          password: userInput.password,
        })
      );
      if (res.type.includes("rejected"))
        return toast({
          title: "An Error Occurred",
          description: res.payload as string,
          variant: "destructive",
        });

      toast({
        title: "User Registration Sucessfull",
        description: "You can now Login to Access your account",
        variant: "success",
      });

      navigate.push("/login");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400 || error.response?.status === 401) {
          return toast({
            title: "Error Creating User",
            description: error.response?.data,
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Error Creating User",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <label htmlFor="name" className="font-bold text-base">
          Name
        </label>
        <Input
          name="name"
          value={userInput.name}
          onChange={handleOnchange}
          type="name"
          placeholder="Your Full Name"
          className="bg-white"
        />
      </div>
      <div className="space-y-4">
        <label htmlFor="name" className="font-bold text-base">
          Email
        </label>
        <Input
          name="email"
          value={userInput.email}
          onChange={handleOnchange}
          type="email"
          placeholder="name@mail.com"
          className="bg-white"
        />
      </div>
      <div className="space-y-4">
        <label htmlFor="name" className="font-bold text-base">
          Phone
        </label>
        <Input
          name="phone"
          value={userInput.phone}
          onChange={handleOnchange}
          type="phone"
          placeholder="+234805657573"
          className="bg-white"
        />
      </div>

      <div className="space-y-4">
        <label htmlFor="name" className="font-bold text-base">
          Password
        </label>
        <Input
          name="password"
          value={userInput.password}
          onChange={handleOnchange}
          type="password"
          placeholder="************ "
          className="bg-white"
        />
      </div>

      <div className="space-y-4">
        <label htmlFor="name" className="font-bold text-base">
          Password Confirmation
        </label>
        <div>
          <Input
            name="password_confirmation"
            value={userInput.password_confirmation}
            onChange={handleOnchange}
            type="password"
            placeholder="************ "
            className="bg-white"
          />
          {userInput.password !== userInput.password_confirmation && (
            <span>Passwords do not match </span>
          )}
        </div>
      </div>
      {/* 
      <div className="grid place-content-center">
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
        onClick={() => handleRegister()}
      >
        Register
      </Button>

      <p className="text-gray-500 text-light text-base text-center">
        Already have an account?{" "}
        <Link className="font-semibold text-brandYellow" href={"/login"}>
          Login
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
