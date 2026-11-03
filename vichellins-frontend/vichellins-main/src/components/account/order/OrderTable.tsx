"use client";

import CustomTable from "@/components/shared/CustomTable";
import { FC } from "react";
import OrderTableBody from "./OrderTableBody";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { getAllOrders } from "@/lib/redux/slices/orders/orderThunk";

interface OrderTableProps {
  activeTab?: number;
}
const OrderTable: FC<OrderTableProps> = ({ activeTab }) => {
  const { currentPage, numberOfPages } = useSelector(
    (store: RootState) => store.orders
  );

  const dispatch = useDispatch<AppDispatch>();

  return (
    <div>
      <CustomTable
        headingList={orderTableHeadings}
        tableBody={<OrderTableBody activeTab={activeTab} />}
        numberOfPages={numberOfPages}
        currentPage={currentPage}
        handleSelectPage={async (index: number) =>
          await dispatch(
            getAllOrders({
              page: index,
            })
          )
        }
        handlePrevPage={async () =>
          await dispatch(
            getAllOrders({
              page: currentPage > 1 ? currentPage - 1 : currentPage,
            })
          )
        }
        handleNextPage={async () =>
          await dispatch(
            getAllOrders({
              page: currentPage + 1,
            })
          )
        }
      />
    </div>
  );
};

export default OrderTable;

const orderTableHeadings = [
  "Order Id",
  "Items",
  "Subtotal",
  "Date",
  "Status",
  "Action",
];
