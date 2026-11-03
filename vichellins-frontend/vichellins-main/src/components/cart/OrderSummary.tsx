"use client";

import { Info } from "lucide-react";
import { FC } from "react";
import { Button } from "../ui/Button";
import { ICart } from "@/types/cart";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { formatToNaira } from "@/kits/helpers/formatToNaira";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/redux/slices/orders/orderThunk";
import { useSession } from "next-auth/react";
import { AxiosError } from "axios";
import { toast } from "@/hooks/useToast";

interface OrderSummaryProps {
  hideBtn?: boolean;
  ordersPage?: boolean;
  items: ICart[] | null;
  total: number;
}
const OrderSummary: FC<OrderSummaryProps> = ({
  hideBtn,
  ordersPage,
  items,
  total,
}) => {
  const { deliveryInformation } = useSelector(
    (store: RootState) => store.checkout
  );
  const { isLoading } = useSelector((store: RootState) => store.orders);
  const { data: session } = useSession();

  const dispatch = useDispatch<AppDispatch>();

  const navigate = useRouter();

  const handleProceedToCheckout = async () => {
    try {
      if (items && session) {
        const res = await dispatch(
          createOrder({
            cart_item_ids: items?.map((i) => i.id),
            user_id: session?.user.id,
          })
        );

        if (res.type.includes("rejected")) {
          return toast({
            title: "An Error Occurred",
            description: res.payload as string,
            variant: "destructive",
          });
        }

        toast({
          title: "Order has been created succesfully",
          variant: "success",
        });

        navigate.push("/checkout");
      } else {
        return toast({
          title: "An Error Occurred",
          description:
            "Please ensure you are logged in and have avialable products in cart",
          variant: "destructive",
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400 || error.response?.status === 401) {
          return toast({
            title: "Error Creating Order",
            description: error.response?.data,
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Error Creating Order",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-12 w-full p-8 border rounded-xl bg-[#F7F8F7] max-w-[46.3rem]">
      <h5 className="text-[1.6rem] font-semibold">Order Summary</h5>
      {items && (
        <>
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between text-base"
            >
              <span className="font-light ">
                {item.quantity} {item.product?.name}
              </span>
              <span className="font-medium">
                {formatToNaira.format(item.product?.price * item?.quantity)}
              </span>
            </div>
          ))}

          <hr className="my-4" />
          <div className="flex items-center justify-between text-[1.6rem]">
            <span className="font-semibold">Subtotal</span>
            <span className="font-semibold">{formatToNaira.format(total)}</span>
          </div>
        </>
      )}
      {!deliveryInformation && !ordersPage && (
        <div className="flex p-4 bg-green-100 gap-4 border rounded-xl border-primary">
          <Info className="text-primary" />
          <p className="text-light text-primary text-base">
            Delivery fees would be added at checkout once we get your delivery
            address
          </p>
        </div>
      )}

      {!hideBtn && !ordersPage && (
        <Button
          isLoading={isLoading}
          disabled={(items && items.length === 0) ?? false}
          onClick={() => {
            handleProceedToCheckout();
          }}
        >
          Proceed to Checkout
        </Button>
      )}
    </div>
  );
};

export default OrderSummary;
