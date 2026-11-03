"use client";

import useGetSingleCustomer from "@/hooks/useGetSingleCustomer";
import { RootState } from "@/lib/redux/store";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import PageHeader from "../account/PageHeader";
import OrderTable from "../account/order/OrderTable";
import PageLoader from "../shared/PageLoader";
import { Button } from "../ui/Button";
import { ArrowLeft } from "lucide-react";

const CustomerOrderPage = () => {
  const { selectedCustomer } = useSelector(
    (store: RootState) => store.customer
  );

  const { customerId } = useParams();
  useGetSingleCustomer({
    customerId: customerId,
  });

  const router = useRouter();

  return (
    <div className="mt-8 bg-white p-6 rounded-xl border space-y-12">
      <div className="flex justify-between items-center ">
        <div className="flex items-center gap-4">
          <Button
            variant={"ghost"}
            className=""
            onClick={() => router.back()}
          >
            <ArrowLeft size={20} />
          </Button>
          {selectedCustomer && (
            <PageHeader
              title={selectedCustomer?.name}
              subTitle={selectedCustomer?.email}
            />
          )}
        </div>
      </div>

      <div className="space-y-6 py-12 text-base border-t border-b font-medium">
        {selectedCustomer ? (
          <>
            <OrderTable />
          </>
        ) : (
          <PageLoader />
        )}
      </div>
    </div>
  );
};

export default CustomerOrderPage;
