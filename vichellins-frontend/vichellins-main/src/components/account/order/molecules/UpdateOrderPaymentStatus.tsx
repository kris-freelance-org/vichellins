import { FC } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { PaymentStatus, cn } from "@/lib/utils";
import {
  getSingleOrder,
  updateOrderStatus,
} from "@/lib/redux/slices/orders/orderThunk";
import { toast } from "@/hooks/useToast";
import { AxiosError } from "axios";

interface UpdateOrderPaymentStatusProps {
  singleOrder?: boolean;
  isGestOrders?: boolean;
}
const UpdateOrderPaymentStatus: FC<UpdateOrderPaymentStatusProps> = ({
  singleOrder,
}) => {
  const { selectedOrder, isLoading } = useSelector(
    (store: RootState) => store.orders
  );
  const dispatch = useDispatch<AppDispatch>();

  const handleUpdateOrderPaymentStatus = async (status: PaymentStatus) => {
    if (!selectedOrder) return;
    try {
      const res = await dispatch(
        updateOrderStatus({
          order_id: selectedOrder.id,
          payment_status: status,
          delivery_status: selectedOrder.delivery_status,
        })
      );
      if (res.type.includes("rejected"))
        return toast({
          title: "An Error Occurred",
          description: res.payload as string,
          variant: "destructive",
        });

      await dispatch(getSingleOrder(selectedOrder.id));

      return toast({
        title: "Order Status Updated Successfully",
        variant: "success",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400 || error.response?.status === 401) {
          return toast({
            title: "Error Creating User",
            description: error.response?.data,
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Error Creating User",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex flex-col gap-1">
          <strong className="text-base capitalize font-semibold">
            Update Payment Status
          </strong>
          <Button
            className={cn(
              selectedOrder?.payment_status === PaymentStatus.paid
                ? "bg-green-200 text-green-800 "
                : selectedOrder?.payment_status === PaymentStatus.pending
                ? "bg-yellow-200 text-yellow-800"
                : selectedOrder?.payment_status === PaymentStatus.all
                ? "bg-gray-50 text-gray-600"
                : "bg-rose-200 text-rose-800",
              " hover:bg-slate-300  hover:text-slate-900",
              singleOrder && " w-full lg:w-[20rem]  "
            )}
            variant="ghost"
          >
            {selectedOrder?.payment_status}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent
        avoidCollisions
        side="bottom"
        className="w-fit p-8 bg-white text-base rounded-2xl shadow-lg"
      >
        <div className="flex flex-col gap-3 text-base ">
          {Object.entries(PaymentStatus)
            .slice(1)
            .map((item) => (
              <Button
                variant={"ghost"}
                isLoading={isLoading}
                onClick={() => handleUpdateOrderPaymentStatus(item[1])}
                key={item[0]}
                className={cn(
                  item[1] === PaymentStatus.paid
                    ? "bg-green-200 text-green-800 "
                    : selectedOrder?.payment_status === PaymentStatus.all
                    ? "bg-gray-50 text-gray-600"
                    : item[1] === PaymentStatus.pending
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-rose-200 text-rose-800",
                  "min-w-[20rem]"
                )}
              >
                {item[1]}
              </Button>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UpdateOrderPaymentStatus;
