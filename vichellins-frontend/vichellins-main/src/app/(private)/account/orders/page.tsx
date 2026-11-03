import PageHeader from "@/components/account/PageHeader";
import OrderTable from "@/components/account/order/OrderTable";
import { FC } from "react";

// interface OrdersProps {}
const Orders: FC = () => {
  return (
    <div className="mt-12">
      <PageHeader title="Orders" subTitle="View Orders" />

      <OrderTable />
    </div>
  );
};

export default Orders;
