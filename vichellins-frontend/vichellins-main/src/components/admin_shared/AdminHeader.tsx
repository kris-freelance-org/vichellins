"use client";

import { cn } from "@/lib/utils";
import { FC } from "react";
import { Input } from "../ui/Input";
import {  LogOut, Search, UserRound, X } from "lucide-react";
import { Button, buttonVariants } from "../ui/Button";
import Link from "next/link";

import useSearchFunc from "@/hooks/search/useSearchFunc";
import useSignout from "@/hooks/useSignout";

const AdminHeader: FC = () => {
  const { clearSearch, search, setSearch, submitSearch } = useSearchFunc();

  const handleSignout = useSignout();

  return (
    <div className="flex w-[85%] p-4 mt-8 justify-between items-center">
      <form
        onSubmit={submitSearch}
        className={cn(
          "flex  items-center max-w-[40rem] gap-3 w-full rounded-xl border border-input py-2 pl-3 pr-6",
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

      <div className="flex items-center">
        {/* <Link
          href={"/admin/notifications"}
          className={cn(
            buttonVariants({
              variant: "ghost",
            })
          )}
        >
          <Bell />
        </Link> */}

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
  );
};

export default AdminHeader;
