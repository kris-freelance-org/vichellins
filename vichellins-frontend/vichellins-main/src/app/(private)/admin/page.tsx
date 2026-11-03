"use client"

import OrderTable from "@/components/account/order/OrderTable";
import OrderAnalytics from "@/components/dashboard/organisms/OrderAnalytics";
import SummaryCardGrids from "@/components/dashboard/organisms/SummaryCardGrids";
import Link from "next/link";
import { FC } from "react";

// interface DashbaordProps {}
const Dashbaord: FC = () => {
  return (
    <div className="mt-8 bg-white p-6 rounded-xl border space-y-12">
      <div className="space-y-4">
        <h4 className="text-2xl font-semibold"> Welcome Admin</h4>
        <p className="text-gray-500 font-light text-base ">
          Manage your store from here
        </p>
      </div>

      <SummaryCardGrids />

      <OrderAnalytics />


      <div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col mb-8">
            <h5 className="text-[#3F434A] text-2xl font-manjari font-bold">
              Recent Orders
            </h5>
            <span className="font-normal text-base">
              The most recent sales are here
            </span>
          </div>
          <Link className="text-[1.4rem] text-green-500 font-medium" href="/admin/orders">See All Orders</Link>
        </div>
        <OrderTable />
      </div>
    </div>
  );
};

export default Dashbaord;
