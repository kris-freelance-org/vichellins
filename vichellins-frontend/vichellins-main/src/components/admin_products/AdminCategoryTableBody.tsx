"use client";

import CustomLoader from "@/components/shared/atom/CustomLoader";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useTargetBreakpoint } from "@/hooks/useTargetBreakpoint";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ICategory } from "@/types/categories";
import CustomBadge from "../shared/atom/CustomBadge";
import { getAllCategories } from "@/lib/redux/slices/category/categoryThunk";
import CategoryTablePopover from "./molecules/CategoryTablePopover";
import Image from "next/image";

// interface AdminCategoryTableBodyProps {}
const AdminCategoryTableBody: FC = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [categoryData, setCategoryData] = useState<ICategory[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { allCategories, filteredCategories } = useSelector(
    (store: RootState) => store.categories
  );

  const [isMobile, setIsMobile] = useState(false);
  useTargetBreakpoint({ setIsMobile, breakPoint: 800 });
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        await dispatch(getAllCategories());
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [dispatch]);

  useEffect(() => {
    if (filteredCategories) {
      setCategoryData(filteredCategories);
    } else {
      setCategoryData(allCategories);
    }
  }, [allCategories, filteredCategories]);

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
        categoryData &&
        categoryData.length > 0 &&
        categoryData.map((category, index) => (
          <TableRow className=" text-base border-b-0" key={index}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell className="font-medium">{category.id}</TableCell>
            <TableCell className="font-medium p-6 flex items-center gap-2">
              <Image
                width={30}
                height={30}
                className="w-[3rem] h-[3rem] rounded-xl"
                src={
                  category?.image || "/images/no-image-placeholder.png"
                }
                alt={category.name}
              />
              {category.name}
            </TableCell>
            {!isMobile && (
              <>
                <TableCell>
                  <CustomBadge status={category.status || true} />
                </TableCell>
              </>
            )}
            <TableCell
              onClick={() => {
                setSelectedOrderId(category.id);
              }}
              className="relative"
            >
              <CategoryTablePopover selectedId={selectedOrderId} />
            </TableCell>
          </TableRow>
        ))}
      {!isLoading && categoryData && categoryData.length === 0 && (
        <TableRow>
          <TableCell rowSpan={0}>
            <h4 className="p-8 text-base font-semibold flex justify-center ">
              No Category Yet
            </h4>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export default AdminCategoryTableBody;
