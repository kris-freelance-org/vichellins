"use client";
import React, { Dispatch, FC, SetStateAction, useRef } from "react";
import { useOnClickOutside } from "@/hooks/useOnclickOutside";
import { sidebarlinks } from "./AdminSidebar";
import SidebarLink from "./molecules/SidebarLink";

interface AdminSidebarDrawerProps {
  setShowDrawer: Dispatch<SetStateAction<boolean>>;
}

const AdminSidebarDrawer: FC<AdminSidebarDrawerProps> = ({ setShowDrawer }) => {
  const ref = useRef(null);
  useOnClickOutside(ref, () => setShowDrawer(false));
  return (
    <div className="fixed z-10 top-0 bottom-0 right-0 left-0 backdrop-blur-sm bg-[#05053040]">
      <div className="bg-primary text-white h-full w-[60%] p-[2rem]">
        <div ref={ref} className="">
          <div className="grid gap-[3rem] py-[4rem]">
            {sidebarlinks.map((item) => (
              <SidebarLink key={item.name} setShowDrawer={setShowDrawer} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebarDrawer;
