import AdminHeader from "@/components/admin_shared/AdminHeader";
import AdminNavMobile from "@/components/admin_shared/AdminNavMobile";
import AdminSidebar from "@/components/admin_shared/AdminSidebar";
import React from "react";
import AuthGuard from "./AuthGuard";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        <div className="hidden lg:flex w-[26.1rem] py-4 pl-4 pr-2 z-30 fixed left-0 top-0 h-full border-r bg-primary">
          <AdminSidebar />
        </div>
        <div className="flex flex-col w-full flex-1 lg:ml-[26.1rem]">
          <div className="h-[5.625rem] w-full flex items-center gap-3 justify-between px-4 py-4 fixed top-0 lg:left-[26.1rem] right-0 z-20">
            <AdminHeader />
          </div>
          <div className="lg:hidden sticky top-0 z-50 bg-white shadow-sm">
            <AdminNavMobile />
          </div>

          {/* Scrollable content */}
          <main className="bg-white p-4 w-full flex-1 overflow-y-auto mt-[4rem] lg:pt-14">
            <div className="w-full">
              <div className="bg-white p-4 flex-1">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
};

export default layout;
