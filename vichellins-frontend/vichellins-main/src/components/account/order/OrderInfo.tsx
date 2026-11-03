import CustomLoader from "@/components/shared/atom/CustomLoader";
import UserAvatar from "@/components/shared/atom/UserAvatar";
import { Separator } from "@/components/ui/separator";
import { RootState } from "@/lib/redux/store";
import { CreditCard, MapPin, Phone, Truck, User } from "lucide-react";
import { FC } from "react";
import { useSelector } from "react-redux";

const OrderInfo: FC = () => {
  const { selectedOrder } = useSelector((store: RootState) => store.orders);

  return (
    <div className=" px-8  bg-white border border-gray-300 rounded-xl lg:h-[28.8rem] flex flex-col lg:flex-row justify-between gap-4 lg:gap-12">
      <div className="space-y-8 flex-1 py-8  border-b lg:border-none">
        <div className="flex gap-3 text-base text-gray-600 ">
          <User />
          <span className="font-light">Customer</span>
        </div>
        {selectedOrder ? (
          <div className="">
            <div className="flex gap-4 items-center">
              <UserAvatar imgUrl="" name={selectedOrder?.user?.name} />
              <div className="flex flex-col">
                <strong className="text-base capitalize font-semibold">
                  {selectedOrder?.user?.name}
                </strong>
                <span className="text-base">{selectedOrder?.user?.email}</span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <CustomLoader width={16} height={16} />
          </div>
        )}
      </div>
      <Separator orientation="vertical" />
      <div className="space-y-8 flex-1 py-8 border-b lg:border-none">
        <div className=" flex flex-col gap-4">
          <div className="flex gap-3 text-base text-gray-600 ">
            <MapPin />
            <span className="font-light">Address</span>
          </div>
          {selectedOrder ? (
            <span className="font-semibold text-base">
              {selectedOrder.user.street}
            </span>
          ) : (
            <div>
              <CustomLoader width={16} height={16} />
            </div>
          )}
        </div>

        <div className=" flex flex-col gap-4 py-8">
          <div className="flex gap-3 text-base text-gray-600 ">
            <Phone />
            <span className="font-light">Contact</span>
          </div>
          {selectedOrder ? (
            <span className="font-semibold text-base">
              {selectedOrder?.user?.phone}
            </span>
          ) : (
            <div>
              <CustomLoader width={16} height={16} />
            </div>
          )}
        </div>
      </div>
      <Separator orientation="vertical" />
      <div className="space-y-8 flex-1 py-8 border-b lg:border-none">
        <div className="flex flex-col gap-4">
          <div className="flex gap-3 text-base text-gray-600 ">
            <CreditCard />
            <span className="font-light">Subtotal</span>
          </div>
          {selectedOrder ? (
            <span className="font-semibold text-base">
              {selectedOrder.total_amount}
            </span>
          ) : (
            <div>
              <CustomLoader width={16} height={16} />
            </div>
          )}
        </div>

        <div className=" flex flex-col gap-4 ">
          <div className="flex gap-3 text-base text-gray-600 ">
            <Truck />
            <span className="font-light">Delivery status</span>
          </div>
          {selectedOrder ? (
            <span className="font-semibold text-base">
              {selectedOrder.delivery_status}
            </span>
          ) : (
            <div>
              <CustomLoader width={16} height={16} />
            </div>
          )}
        </div>
        <div className=" flex flex-col gap-4 ">
          <div className="flex gap-3 text-base text-gray-600 ">
            <Truck />
            <span className="font-light">Total Amount </span>
          </div>
          {selectedOrder ? (
            <span className="font-semibold text-base">
              {selectedOrder.total_amount}
            </span>
          ) : (
            <div>
              <CustomLoader width={16} height={16} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderInfo;
