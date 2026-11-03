"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "@/hooks/useToast";
import { UserRole } from "@/kits/data/user";
import { signIn, useSession } from "next-auth/react";
import {
  emptyLocalCart,
  getCartItems,
  massLoadCartItems,
} from "@/lib/redux/slices/cart/cartThunk";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { AxiosError } from "axios";
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// import ReCAPTCHA from "react-google-recaptcha";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
  type: "admin" | "customer";
}

const LoginForm: FC<LoginFormProps> = ({ type }) => {
  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // const [noCaptcha, setNoCaptcha] = useState(true);

  const { redirectPath } = useSelector((store: RootState) => store.auth);
  const { cartItems } = useSelector((store: RootState) => store.cart);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useRouter();

  const { data: session } = useSession();

  useEffect(() => {
    const getData = async () => {
      if (session && session.token) {
        if (session.user?.role === UserRole.super_admin) {
          navigate.push("/admin");
        } else {
          if (cartItems && cartItems.length > 0) {
            await dispatch(
              massLoadCartItems(
                cartItems.map((item) => ({
                  product_id: item.id,
                  quantity: item.quantity,
                }))
              )
            );
            await dispatch(getCartItems());
            dispatch(emptyLocalCart());
          }
          navigate.push(redirectPath);
        }
      }
    };

    getData();
  }, [session]);

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setUserInput({ ...userInput, [name]: value });
  };

  const handleLogin = async () => {
    if (!userInput.email || !userInput.password) {
      return toast({
        title: "Invalid Input",
        description: "Please Enter All Fields",
        variant: "destructive",
      });
    }

    try {
      setIsLoading(true);

      const res = await signIn("credentials", {
        redirect: false,
        ...userInput,
        type,
      });

      if (!res?.ok) {
        return toast({
          title: "An Error Occurred",
          description: res?.error || "Could not Authenticate user",
          variant: "destructive",
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400 || error.response?.status === 401) {
          return toast({
            title: "Error in Login",
            description: error.response?.data,
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Error in Login",
        description: typeof error === "string" ? error : "Something went wrong",
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
      <div>
        <div className="space-y-4">
          <label htmlFor="name" className="font-bold text-base">
            Password
          </label>
          <div className="flex relative h-[4rem] w-full rounded-xl border border-input bg-transparent   text-base ring-offset-background file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <Input
              name="password"
              value={userInput.password}
              onChange={handleOnchange}
              type={showPassword ? "text" : "password"}
              placeholder="************ "
              className="border-none p-0 text-black placeholder:text-gray-500 px-6 rounded-none focus-visible:outline-none focus-visible:ring-none focus-visible:ring-offset-0 focus-visible:ring-0"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-6 top-3"
            >
              {showPassword ?  <EyeOff />  : <Eye />}
            </button>
          </div>

          <Link
            className=" flex justify-end text-base font-semibold text-brandYellow"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
      </div>

      {/* <div className="grid place-content-center">
        <ReCAPTCHA
          className="w-full text-sm"
          sitekey={process.env.VITE_RECAPTCHA_SITE_KEY as string}
          onChange={() => setNoCaptcha(false)}
        />
      </div> */}
      <Button
        className="w-full"
        disabled={isLoading}
        isLoading={isLoading}
        onClick={handleLogin}
      >
        Login
      </Button>

      <p className="text-gray-500 text-light text-base text-center">
        Dont have an account?{" "}
        <Link className="font-semibold text-brandYellow" href={"/register"}>
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
