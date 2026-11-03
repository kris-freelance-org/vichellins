import CustomBadge from "@/components/shared/atom/CustomBadge";
import CustomLoader from "@/components/shared/atom/CustomLoader";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useTargetBreakpoint } from "@/hooks/useTargetBreakpoint";
import { UserRole } from "@/kits/data/user";
import {
  getAllOrders,
  getAllOrdersByMe,
  getAllOrdersByUser,
} from "@/lib/redux/slices/orders/orderThunk";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { format } from "date-fns";
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OrderTablePopover from "./OrderTablePopover";
import { DeliveryStatus } from "@/lib/utils";
import { formatToNaira } from "@/kits/helpers/formatToNaira";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface OrderTableBodyProps {
  activeTab?: number;
}
const OrderTableBody: FC<OrderTableBodyProps> = ({ activeTab }) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const { customerId } = useParams();

  const { filteredOrders, isLoading, allOrders } = useSelector(
    (store: RootState) => store.orders
  );

  const { data: session } = useSession();

  const isSuperAdminOrAdmin =
    session?.user?.role == UserRole.super_admin ||
    session?.user?.role == UserRole.admin;

  const [isMobile, setIsMobile] = useState(false);
  useTargetBreakpoint({ setIsMobile, breakPoint: 800 });
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getData = async () => {
      if (!session?.user) return;
      try {
        if (
          (session.user.role === UserRole.super_admin ||
            session.user.role === UserRole.admin) &&
          !customerId
        ) {
          await dispatch(getAllOrders({}));
        } else if (customerId) {
          await dispatch(getAllOrdersByUser(customerId as string));
        } else if (session.user.role === UserRole.customer) {
          await dispatch(getAllOrdersByMe());
        }
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [dispatch, customerId, session]);

  useEffect(() => {
    const getData = async () => {
      if (activeTab === 1) {
        await dispatch(
          getAllOrders({
            delivery_status: DeliveryStatus.shipped,
          })
        );
      } else if (activeTab === 2) {
        await dispatch(
          getAllOrders({
            delivery_status: DeliveryStatus.processing,
          })
        );
      } else if (activeTab === 3) {
        await dispatch(
          getAllOrders({
            delivery_status: DeliveryStatus.delivered,
          })
        );
      } else if (activeTab === 4) {
        await dispatch(
          getAllOrders({
            delivery_status: DeliveryStatus.cancelled,
          })
        );
      } else {
        await dispatch(getAllOrders({}));
      }
    };

    getData();
  }, [activeTab, filteredOrders, dispatch]);

  return (
    <TableBody>
      {isLoading && (
        <TableRow>
          <TableCell rowSpan={0}>
            <CustomLoader height={30} width={30} />
          </TableCell>
        </TableRow>
      )}
      {!isLoading &&
        allOrders &&
        allOrders.length > 0 &&
        allOrders.map((order, index) => (
          <TableRow className=" text-base border-b-0" key={index}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell className="font-medium">{order.id}</TableCell>
            <TableCell className="font-medium p-6">
              {order.items.length} item(s)
            </TableCell>
            {!isMobile && (
              <>
                <TableCell className="font-medium p-6">
                  {formatToNaira.format(Number(order.total_amount))}
                </TableCell>
                <TableCell className="font-medium flex flex-col items-start p-6">
                  <span> {format(order.createdAt, "dd/LL/yyyy")}</span>
                  <span className="text-[#999999]">
                    {" "}
                    {format(order.createdAt, "hh:mm aaa")}
                  </span>
                </TableCell>

                <TableCell>
                  <CustomBadge status={order.delivery_status} />
                </TableCell>
              </>
            )}
            {session?.user?.role === UserRole.admin ? (
              <TableCell
                onClick={() => {
                  setSelectedOrderId(order.id.toString());
                }}
                className="relative"
              >
                <OrderTablePopover selectedId={selectedOrderId} />
              </TableCell>
            ) : (
              <TableCell>
                <Link
                  className="font-semibold text-green-500 text-base"
                  href={
                    isSuperAdminOrAdmin
                      ? `/admin/orders/${order.id}`
                      : `/account/orders/${order.id}`
                  }
                >
                  View Order
                </Link>
              </TableCell>
            )}
          </TableRow>
        ))}
      {!isLoading && allOrders && allOrders.length === 0 && (
        <TableRow>
          <TableCell rowSpan={0}>
            <h4 className="p-8 text-base font-semibold flex justify-center ">
              No Order has been made yet
            </h4>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export default OrderTableBody;
