"use client";

import OrderItem from "@/components/account/order/molecules/OrderItem";
import OrderSummary from "@/components/cart/OrderSummary";
import CustomLoader from "@/components/shared/atom/CustomLoader";
import { getSingleOrder } from "@/lib/redux/slices/orders/orderThunk";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { useParams } from "next/navigation";
import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// interface SingleOrderProps {}

const SingleOrder: FC = () => {
  const { selectedOrder, isLoading } = useSelector(
    (store: RootState) => store.orders
  );

  const { orderId } = useParams();

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getData = async () => {
      if (!orderId) return;
      try {
        await dispatch(getSingleOrder(Number(orderId as string)));
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [dispatch, orderId]);
  return (
    <div className="w-frame mt-8 space-y-12">
      <h4 className="text-[1.8rem] font-medium text-gray-800">
        Order <span className="text-black">{selectedOrder?.id}</span>
      </h4>

      <div className="grid  lg:grid-cols-2 gap-24 justify-between ">
        <div className="space-y-8 flex-1 order-2 lg:order-1">
          {selectedOrder &&
            !isLoading &&
            selectedOrder.items.map((item, index) => (
              <React.Fragment key={index}>
                <OrderItem orderItem={item} />
              </React.Fragment>
            ))}

          {isLoading && <CustomLoader width={24} height={24} />}
          {!isLoading && selectedOrder?.items?.length === 0 && (
            <div className="text-2xl text-primary font-semibold flex h-[20rem] justify-center items-center">
              No Items in this Order
            </div>
          )}
        </div>

        <div className="order-1 lg:order-2 flex justify-end h-fit w-full">
          {selectedOrder && (
            <OrderSummary
              total={Number(selectedOrder.total_amount)}
              items={null}
              ordersPage
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleOrder;
