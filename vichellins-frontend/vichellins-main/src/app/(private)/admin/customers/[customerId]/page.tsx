"use client";

import PageHeader from "@/components/account/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import { buttonVariants } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import useGetSingleCustomer from "@/hooks/useGetSingleCustomer";
import { RootState } from "@/lib/redux/store";
import { cn } from "@/lib/utils";
import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";

const ViewCustomers = () => {
  const { selectedCustomer } = useSelector(
    (store: RootState) => store.customer
  );

  const { customerId } = useParams();

  useGetSingleCustomer({
    customerId: customerId,
  });

  return (
    <div className="mt-8 bg-white p-6 rounded-xl border space-y-12">
      <div className="flex justify-between items-center ">
        {selectedCustomer && (
          <PageHeader
            title={selectedCustomer?.name}
            subTitle={selectedCustomer?.email}
          />
        )}
        <Link
          className={cn(
            buttonVariants({ variant: "outline", className: "gap-3" })
          )}
          href={`/admin/customers/${selectedCustomer?.id}/orders`}
        >
          <ArrowRight />
          Go to Order History
        </Link>
      </div>

      <div className="space-y-6 py-12 text-base border-t border-b font-medium">
        {selectedCustomer ? (
          <>
            <div className="grid items-center gap-3 md:grid-cols-[1fr_2fr]">
              <label htmlFor="">Name</label>
              <div className="flex gap-4 items-center md:w-[70%]">
                <Input
                  value={selectedCustomer.name}
                  readOnly={true}
                  name="name"
                  className=" focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>

            <hr />
            <div className="grid items-center gap-3 md:grid-cols-[1fr_2fr]">
              <label htmlFor="">Email Address</label>

              <div className="border rounded-lg flex items-center gap-3 px-6 py-4  h-18 md:w-[70%]">
                <Mail className="text-gray-500" />
                <Input
                  value={selectedCustomer.email}
                  name="email"
                  readOnly={true}
                  placeholder="Email"
                  className=" focus-visible:ring-0 focus-visible:ring-offset-0 border-0 py-0 m-0"
                />
              </div>
            </div>
            <hr />
            <div className="grid items-center gap-3 md:grid-cols-[1fr_2fr]">
              <label htmlFor="">Phone</label>

              <Input
                value={selectedCustomer.phone}
                name="phone"
                readOnly={true}
                placeholder="Phone Number"
                className=" focus-visible:ring-0 focus-visible:ring-offset-0 md:w-[70%]"
              />
            </div>
            <hr />
            <div className="grid items-center gap-3 md:grid-cols-[1fr_2fr]">
              <label htmlFor="">Address</label>

              <Input
                value={selectedCustomer.street || "No Address"}
                name="address"
                readOnly={true}
                className=" focus-visible:ring-0 focus-visible:ring-offset-0 md:w-[70%]"
              />
            </div>
            <hr />
            <div className="grid items-center gap-3 md:grid-cols-[1fr_2fr]">
              <label htmlFor="">LGA</label>

              <Input
                value={selectedCustomer.city || "No City"}
                name="lga"
                readOnly={true}
                className=" focus-visible:ring-0 focus-visible:ring-offset-0 md:w-[70%]"
              />
            </div>
            <hr />
            <div className="grid items-center gap-3 md:grid-cols-[1fr_2fr]">
              <label htmlFor="">State</label>

              <Input
                value={selectedCustomer.state || "No State"}
                name="state"
                readOnly={true}
                className=" focus-visible:ring-0 focus-visible:ring-offset-0 md:w-[70%]"
              />
            </div>
          </>
        ) : (
          <PageLoader />
        )}
      </div>
    </div>
  );
};

export default ViewCustomers;
