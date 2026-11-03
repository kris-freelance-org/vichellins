"use client"

import CustomLoader from "@/components/shared/atom/CustomLoader";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useTargetBreakpoint } from "@/hooks/useTargetBreakpoint";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductsTablePopover from "./ProductsTablePopover";
import { IProduct } from "@/types/products";
import {  getAllProductsAdmin } from "@/lib/redux/slices/products/productThunk";
import Image from "next/image";
import { formatToNaira } from "@/kits/helpers/formatToNaira";

// interface AdminProductsTableBodyProps {}
const AdminProductsTableBody: FC = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [productData, setProductData] = useState<IProduct[] | null>(null);
  const { filteredProducts, allProducts, isLoading } = useSelector(
    (store: RootState) => store.products
  );

  const [isMobile, setIsMobile] = useState(false);
  useTargetBreakpoint({ setIsMobile, breakPoint: 800 });
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getData = async () => {
      try {
        await dispatch(getAllProductsAdmin());
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [dispatch]);

  useEffect(() => {
    if (filteredProducts) {
      setProductData(filteredProducts as IProduct[]);
    } else {
      setProductData(allProducts);
    }
  }, [filteredProducts, dispatch, allProducts]);

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
        productData &&
        productData.length > 0 &&
        productData.map((product, index) => (
          <TableRow className=" text-base bproduct-b-0" key={index}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell className="font-medium">
              {product?.id}
            </TableCell>
            <TableCell className="font-medium p-6 flex items-center gap-2">
              <Image
                width={50}
                height={50}
                className="w-[4rem] h-[4rem] object-cover rounded-xl"
                src={
                  product?.mainImage ||
                  "/images/no-image-placeholder.png"
                }
                alt={product?.name}
              />
              {product?.name}
            </TableCell>
            {!isMobile && (
              <>
                <TableCell className="font-medium p-6">
                  {product?.category?.name}
                </TableCell>
                <TableCell className="font-medium p-6">
                  {formatToNaira.format(product?.price)}
                  
                </TableCell>
              </>
            )}
            <TableCell
              onClick={() => {
                setSelectedOrderId(product?.id);
              }}
              className="relative"
            >
              <ProductsTablePopover productName={product?.name} selectedId={selectedOrderId} />
            </TableCell>
          </TableRow>
        ))}
      {!isLoading && productData && productData.length === 0 && (
        <TableRow>
          <TableCell rowSpan={0}>
            <h4 className="p-8 text-base font-semibold flex justify-center ">
              No Product Yet
            </h4>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export default AdminProductsTableBody;
