import { Badge } from "@/components/ui/badge";
import { DeliveryStatus, TicketStatus, TransactionStatus } from "@/lib/utils";
import { FC } from "react";
import { GoDotFill } from "react-icons/go";

interface CustomBadgeProps {
  isMdaHeader?: boolean;
  status: DeliveryStatus | TicketStatus | TransactionStatus | boolean;
}
const CustomBadge: FC<CustomBadgeProps> = ({ status }) => {
  return (
    <>
      {
        <Badge
          className={`${
            status === DeliveryStatus.delivered ||
            status === TransactionStatus.success ||
            status === true
              ? "bg-[#F1FCF6] text-[#229745]"
              : status === DeliveryStatus.processing ||
                status === TicketStatus.processing
              ? "bg-[#fffaeb] text-[#f9cf46]"
              : status === DeliveryStatus.shipped
              ? "bg-blue-100 text-blue-500"
              : status === TicketStatus.unassigned
              ? "bg-gray-100 text-gray-600"
              : "bg-[#f5e2e2] text-[#e23636]"
          } hover:bg-default w-fit flex gap-2 items-center text-[1.2rem] h-fit`}
        >
          <GoDotFill
            className={
              status === DeliveryStatus.delivered ||
              status === TransactionStatus.success ||
              status === true
                ? " text-[#229745]"
                : status === DeliveryStatus.processing ||
                  status === TicketStatus.processing
                ? " text-[#f9cf46]"
                : status === DeliveryStatus.shipped
                ? " text-blue-500"
                : status === TicketStatus.unassigned
                ? " text-gray-600"
                : " text-[#344054]"
            }
          />

          {status === DeliveryStatus.delivered
            ? "Completed"
            : status === TransactionStatus.success
            ? "Success"
            : status === DeliveryStatus.processing ||
              status === TicketStatus.processing
            ? "Processing"
            : status === DeliveryStatus.shipped
            ? "Enroute"
            : status === TicketStatus.unassigned
            ? "Unassigned"
            : status === TicketStatus.closed
            ? "Closed"
            : status === true
            ? "Active"
            : status === false
            ? "Inactive"
            : "Failed"}
        </Badge>
      }
    </>
  );
};

export default CustomBadge;
