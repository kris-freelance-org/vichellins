"use client";

import { FC, useState } from "react";
import { Bell, LogOut, Menu, Search, UserRound, X } from "lucide-react";
import Brand from "../shared/atom/Brand";
import Link from "next/link";
import { Input } from "../ui/Input";
import useSearchFunc from "@/hooks/search/useSearchFunc";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/Button";
import useSignout from "@/hooks/useSignout";
import AdminSidebarDrawer from "./AdminSidebarDrawer";

const AdminNavMobile: FC = () => {
  const { clearSearch, search, setSearch, submitSearch } = useSearchFunc();
  const handleSignout = useSignout();
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <div className="flex flex-col gap-4 text-white">
      <div className="flex items-center p-4  bg-primary justify-between">
        <div className="lg:min-w-[40rem] flex gap-2 items-center">
          <button
            className="lg:hidden"
            onClick={() => setShowDrawer(!showDrawer)}
          >
            <Menu className="text-white" />
          </button>
          <div className="flex cursor-pointer gap-4 pl-0 ml-0 justify-start">
            <Brand />
          </div>
        </div>
        <div className="flex items-center">
          <Link
            href={"/admin/notifications"}
            className={cn(
              buttonVariants({
                variant: "ghost",
              })
            )}
          >
            <Bell />
          </Link>

          <Link
            href={"/admin/profile"}
            className={cn(
              buttonVariants({
                variant: "ghost",
              })
            )}
          >
            <UserRound />
          </Link>
          <Button
            onClick={handleSignout}
            variant={"ghost"}
            className="text-rose-500"
          >
            <LogOut />
          </Button>
        </div>
      </div>
      <form
        onSubmit={submitSearch}
        className={cn(
          "flex  items-center  gap-3 w-full rounded-xl border border-input py-2 pl-3 pr-6",
          "bg-white text-gray-700"
        )}
      >
        <Search />
        <Input
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Items here..."
          value={search}
          className="border-0 h-16 ring-offset-none outline-none shadow-none focus-visible:outline-none focus-visible:ring-none focus-visible:ring-transparent"
        />
        {search && (
          <button onClick={clearSearch} type="button">
            <X className="text-rose-500" />
          </button>
        )}
      </form>
      {showDrawer ? <AdminSidebarDrawer setShowDrawer={setShowDrawer} /> : null}
    </div>
  );
};

export default AdminNavMobile;
