"use client";

import OrderInfo from "@/components/account/order/OrderInfo";
import OrderProductTableBody from "@/components/account/order/molecules/OrderProductTableBody";
import UpdateOrderStatus from "@/components/account/order/molecules/UpdateOrderStatus";
import CustomTable from "@/components/shared/CustomTable";
import { Button } from "@/components/ui/Button";
import { getSingleOrder } from "@/lib/redux/slices/orders/orderThunk";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { ArrowLeft } from "lucide-react";
import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  moveNextPage,
  movePrevPage,
  selectPage,
} from "@/lib/redux/slices/orders/orderSlice";
import { useParams, useRouter } from "next/navigation";
import UpdateOrderPaymentStatus from "@/components/account/order/molecules/UpdateOrderPaymentStatus";

const AdminSingleOrder: FC = () => {
  const { currentPage, selectedOrder, numberOfPages } = useSelector(
    (store: RootState) => store.orders
  );

  const { orderId } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  useEffect(() => {
    const getData = async () => {
      if (!orderId) return;
      try {
        await dispatch(getSingleOrder(Number(orderId)));
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [dispatch, orderId]);

  return (
    <div className=" space-y-12 ">
      <div className="flex flex-col gap-4 lg:flex-row justify-between border-b items-center py-8">
        <div className="flex gap-3 items-center">
          <Button
            variant={"ghost"}
            className="p-0 m-0"
            onClick={() => router.back()}
          >
            <ArrowLeft size={17} />
          </Button>

          <h5 className="font-semibold text-2xl">
            Order: <span className="font-bold">{selectedOrder?.id}</span>
          </h5>
        </div>

        <div className="flex gap-4">
          <UpdateOrderStatus singleOrder />
          <UpdateOrderPaymentStatus singleOrder />
        </div>
      </div>

      <OrderInfo />

      <div>
        <CustomTable
          headingList={orderProductTableHeadings}
          tableBody={<OrderProductTableBody />}
          numberOfPages={numberOfPages}
          currentPage={currentPage}
          handleSelectPage={(index: number) => dispatch(selectPage(index))}
          handlePrevPage={() => dispatch(movePrevPage())}
          handleNextPage={() => dispatch(moveNextPage())}
        />
      </div>
    </div>
  );
};

export default AdminSingleOrder;

const orderProductTableHeadings = [
  "Product Id",
  "Product",
  "Quantity",
  "Price",
];
