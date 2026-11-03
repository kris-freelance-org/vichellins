"use client";

import { FormEvent, useRef, useState } from "react";

import {
  Heart,
  LogOut,
  Search,
  ShoppingBag,
  ShoppingCart,
  User,
} from "lucide-react";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { logout } from "@/lib/redux/slices/auth/authSlice";
import { emptyLocalCart } from "@/lib/redux/slices/cart/cartThunk";
import { updateCartStateValues } from "@/lib/redux/slices/cart/cartSlice";
import Brand from "./atom/Brand";
import Link from "next/link";
import { Input } from "../ui/Input";
import { useOnClickOutside } from "@/hooks/useOnclickOutside";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const TopNavbar = () => {
  const { data: session } = useSession();

  const { cartItems } = useSelector((store: RootState) => store.cart);
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const ref = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useOnClickOutside(ref, () => setShowSearch(false));

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    router.push(`/search?value=${searchValue}`);
  };

  return (
    <div ref={ref} className="py-8 bg-primary text-white ">
      <div className="w-frame mx-auto flex items-center gap-12 justify-between text-base">
        <Brand />

        <div className="flex-1 flex gap-16 lg:gap-20 items-center">
          {navLinks.map((navItem) => (
            <Link
              className="hover:text-brandYellow font-semibold"
              key={navItem.id}
              href={navItem.link}
            >
              {navItem.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <div className=" flex justify-center items-center">
            {showSearch ? (
              <form
                onSubmit={handleSearch}
                className="bg-white pr-[1rem] inline-flex items-center justify-center  rounded-md"
              >
                <Input
                  onChange={(e) => setSearchValue(e.target.value)}
                  className=" w-[40rem] text-black border-none rounded-sm outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
                  placeholder="Search Product Here..."
                />
                <Search color="#000" />
              </form>
            ) : (
              <Button
                onClick={() => setShowSearch(true)}
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    className:
                      "hover:bg-transparent hover:text-brandYellow p-0 m-0 w-fit h-fit",
                  })
                )}
              >
                <Search />
              </Button>
            )}
          </div>
          <Link href={"/cart"} className="hover:text-brandYellow relative">
            <ShoppingCart />
            <span className="absolute -top-4 -right-4 flex justify-center items-center rounded-full bg-rose-500 h-8 w-8 font-bold text-white">
              {(cartItems && cartItems.length) || 0}
            </span>
          </Link>

          {session?.token ? (
            <ProfilePopOver />
          ) : (
            <Link
              className={cn(
                buttonVariants({
                  className:
                    "bg-brandYellow text-primary hover:bg-brandYellow/50",
                })
              )}
              href="/login"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;

const navLinks = [
  {
    id: 1,
    name: "Home",
    link: "/",
  },
  {
    id: 2,
    name: "Products",
    link: "/shop",
  },

  {
    id: 4,
    name: "Contact Us",
    link: "/contact-us",
  },
];

export const ProfilePopOver = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut({ redirect: false });
      dispatch(logout());
      dispatch(
        updateCartStateValues({
          name: "cartItems",
          value: null,
        })
      );
      await dispatch(emptyLocalCart());
      setOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          className="w-fit p-2  h-fit hover:text-brandYellow "
        >
          <User />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        avoidCollisions
        side="bottom"
        className="w-[14rem] p-8 bg-white text-base rounded-2xl shadow-lg"
      >
        {session?.token ? (
          <div className="flex flex-col space-y-3 ">
            <Link
              onClick={() => setOpen(false)}
              href="/account"
              className="flex gap-3 hover:bg-gray-100 p-2 items-center"
            >
              <User size={18} />
              <span>Pofile</span>
            </Link>
            <Link
              onClick={() => setOpen(false)}
              href="/account/orders"
              className="flex hover:bg-gray-100  p-2 gap-3 items-center"
            >
              <ShoppingBag size={18} />
              <span>Orders</span>
            </Link>
            <Link
              onClick={() => setOpen(false)}
              href="/account/wishlist"
              className="flex hover:bg-gray-100  p-2 gap-3 items-center"
            >
              <Heart size={18} />
              <span>Wishlist</span>
            </Link>
            <Button
              isLoading={isLoading}
              variant={"ghost"}
              onClick={handleLogout}
              className="flex gap-3 w-full py-0 px-0  h-fit hover:bg-gray-100 p-2  justify-start text-rose-500  items-center"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </Button>
          </div>
        ) : (
          <div>
            <Link
              onClick={() => setOpen(false)}
              href="/login"
              className="flex hover:bg-gray-100  p-2 gap-3 items-center"
            >
              <span>Login</span>
            </Link>
            <Link
              onClick={() => setOpen(false)}
              href="/register"
              className="flex hover:bg-gray-100  p-2 gap-3 items-center"
            >
              <span>Register</span>
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
