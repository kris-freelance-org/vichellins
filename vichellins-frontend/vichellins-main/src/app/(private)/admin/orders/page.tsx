"use client";

import OrderTable from "@/components/account/order/OrderTable";
import ButtonTabsBox from "@/components/admin_shared/molecules/ButtonTabsBox";
import { DeliveryStatus } from "@/lib/utils";
import { FC, useState } from "react";

const AdminOrders: FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="mt-8 bg-white p-6 rounded-xl border space-y-12">
      <div className="flex flex-col mb-8">
        <h5 className="text-[#3F434A] text-2xl font-manjari font-bold">
          All Orders
        </h5>
        <span className="font-normal text-base">
          Manage your Orders from Here
        </span>
      </div>

      <ButtonTabsBox
        tabs={Object.values(DeliveryStatus).map((item) => item.toString())}
        activeIndex={activeTab}
        btnOnclick={(index: number) => setActiveTab(index)}
      />
      <OrderTable activeTab={activeTab} />
    </div>
  );
};

export default AdminOrders;
