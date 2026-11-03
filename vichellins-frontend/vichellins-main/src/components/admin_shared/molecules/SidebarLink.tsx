import React, { Dispatch, FC, SetStateAction } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface SidebarLinkProps {
  item: {
    name: string;
    link: string;
    icon: React.JSX.Element;
  };
  setShowDrawer?: Dispatch<SetStateAction<boolean>>;
}

const SidebarLink: FC<SidebarLinkProps> = ({ item, setShowDrawer }) => {
  const pathname = usePathname();

  return (
    <Link
      key={item.link}
      href={item.link}
      onClick={() => setShowDrawer && setShowDrawer(false)}
      className={cn(
        "px-4 py-6 flex gap-4 text-base rounded-xl items-center hover:bg-[#FFFFFF1A]/20",
        ((item.link !== "/admin" && pathname.includes(item.link)) ||
          (pathname === "/admin" && pathname === item.link)) &&
          "bg-[#FFFFFF1A]"
      )}
    >
      {item.icon}
      {item.name}
    </Link>
  );
};

export default SidebarLink;
