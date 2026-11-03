import CustomLoader from "@/components/shared/atom/CustomLoader";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useTargetBreakpoint } from "@/hooks/useTargetBreakpoint";
import { RootState } from "@/lib/redux/store";
import Image from "next/image";
import { FC, useState } from "react";
import { useSelector } from "react-redux";

const OrderProductTableBody: FC = () => {
  const { selectedOrder, isLoading } = useSelector(
    (store: RootState) => store.orders
  );

  const [isMobile, setIsMobile] = useState(false);
  useTargetBreakpoint({ setIsMobile, breakPoint: 800 });

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
        selectedOrder &&
        selectedOrder.items.length > 0 &&
        selectedOrder.items.map((product, index) => (
          <TableRow className=" text-base bproduct-b-0" key={index}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell className="font-medium">
              {product.product_id}
            </TableCell>
            <TableCell className="font-medium p-6 flex items-center gap-2">
              <Image
                width={40}
                height={40}
                className="w-[3rem] h-[3rem] rounded-xl"
                src={
                  product?.product_image ||
                  "/images/no-image-placeholder.png"
                }
                alt={product?.product_name || "sample"}
              />
              {product?.product_name}
            </TableCell>
            {!isMobile && (
              <>
                <TableCell className="font-medium p-6">
                  {product.product_quantity}
                </TableCell>
                <TableCell className="font-medium p-6">
                  {product?.product_price}
                </TableCell>
              </>
            )}
          </TableRow>
        ))}
      {!isLoading &&
        selectedOrder &&
        selectedOrder.items.length == 0 && (
          <TableRow>
            <TableCell rowSpan={0}>
              <h4 className="p-8 text-base font-semibold flex justify-center ">
                No Product in this Order
              </h4>
            </TableCell>
          </TableRow>
        )}
    </TableBody>
  );
};

export default OrderProductTableBody;
