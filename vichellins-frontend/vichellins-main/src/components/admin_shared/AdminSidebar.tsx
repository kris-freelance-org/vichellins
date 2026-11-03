"use client";

import { FC } from "react";
import Brand from "../shared/atom/Brand";
import { CircleUserRound, Home, ShoppingBag, ShoppingCart } from "lucide-react";
import UserAvatar from "../shared/atom/UserAvatar";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import SidebarLink from "./molecules/SidebarLink";

const AdminSidebar: FC = () => {
  const { userProfile } = useSelector((store: RootState) => store.auth);

  return (
    <div className="w-full py-8 px-4 bg-primary text-white">
      <div className=" relative grid content-start min-h-[80rem] h-full space-y-8">
        <Brand />

        <div className="space-y-4 h-full">
          {sidebarlinks.map((item) => (
            <SidebarLink key={item.name} item={item} />
          ))}
        </div>

        {userProfile && (
          <div className="absolute bottom-16 flex gap-3 items-center text-base">
            <div className="text-primary">
              <UserAvatar imgUrl="" name={userProfile.name} />
            </div>
            <div className="flex flex-col">
              <strong>{userProfile.name}</strong>
              <span className="text-[1.2rem]">{userProfile.email}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar;

export const sidebarlinks = [
  {
    name: "Dashboard",
    link: "/admin",
    icon: <Home />,
  },
  {
    name: "Orders",
    link: "/admin/orders",
    icon: <ShoppingCart />,
  },

  {
    name: "Products",
    link: "/admin/products",
    icon: <ShoppingBag />,
  },
  {
    name: "Customers",
    link: "/admin/customers",
    icon: <CircleUserRound />,
  },
  {
    name: "Admins",
    link: "/admin/staffs",
    icon: <CircleUserRound />,
  },

  {
    name: "Profile",
    link: "/admin/profile",
    icon: <CircleUserRound />,
  },
];
