import { formatToNaira } from "@/kits/helpers/formatToNaira";
import { IOrderItems } from "@/types/order";
import Image from "next/image";
import { FC } from "react";

interface OrderItemProps {
  orderItem: IOrderItems;
}
const OrderItem: FC<OrderItemProps> = ({ orderItem }) => {
  return (
    <div className="flex gap-6 border rounded-lg p-3 items-center justify-between">
      <div className="flex gap-6">
        <Image
          width={150}
          height={150}
          className="w-[15rem] h-[10rem] object-cover"
          src={
            orderItem.product_image ?? "/images/no-image-placeholder.png"
          }
          alt={orderItem.product_name}
        />
        <div className="space-y-4">
          <h5 className="font-light text-[1.6rem] ">
            {" "}
            {orderItem.product_name}
          </h5>
          <h6 className="text-base font-bold">
            {formatToNaira.format(orderItem.product_price)}
          </h6>

          <div className="text-base space-x-4">
            <span className="font-light">Quantity:</span>
            <strong className="font-semibold">{orderItem.product_quantity}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
