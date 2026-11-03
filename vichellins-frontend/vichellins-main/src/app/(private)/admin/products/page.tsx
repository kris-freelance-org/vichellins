"use client"

import AdminProductsTableBody from "@/components/admin_products/AdminProductsTableBody";
import ButtonTabsBox from "@/components/admin_shared/molecules/ButtonTabsBox";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "@/components/shared/CustomTable";
import AdminCategoryTableBody from "@/components/admin_products/AdminCategoryTableBody";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";
import { NewCategoryDialog } from "@/components/admin_products/molecules/NewCategoryDialog";
import { getAllProducts } from "@/lib/redux/slices/products/productThunk";
import { getAllCategories } from "@/lib/redux/slices/category/categoryThunk";
import Link from "next/link";

// interface AdminAllProductsProps {}
const AdminAllProducts: FC = () => {
  const [activeTab, setActiveTab] = useState(0);
 
  const { currentPage, numberOfPages } = useSelector(
    (store: RootState) => store.products
  );
  const {
    currentPage: categoryCurrentPage,
    numberOfPages: categoryNumOfPages,
  } = useSelector((store: RootState) => store.categories);

  const dispatch = useDispatch<AppDispatch>();
  return (
    <div className="mt-8 bg-white p-6 rounded-xl border space-y-12">
      <div className="flex itenms-center justify-between">
        <div className="flex flex-col mb-8">
          <h5 className="text-[#3F434A] text-2xl font-manjari font-bold">
            All Products
          </h5>
          <span className="font-normal text-base">
            Manage your Products from Here
          </span>
        </div>

        <div className="flex flex-col items-center sm:flex-row gap-6 lg:gap-12 ">
          <Link
            className={cn(buttonVariants(), "w-full border-primary")}
            href={"/admin/products/add"}
          >
            <Plus />
            Add Product
          </Link>
          <NewCategoryDialog />
        </div>
      </div>

      <ButtonTabsBox
        tabs={["Products", "Categories"].map((item) => item.toString())}
        activeIndex={activeTab}
        btnOnclick={(index: number) => {
          setActiveTab(index);
          
        }}
      />
      <CustomTable
        headingList={
          activeTab === 0 ? productsTableHeading : categoryTableHeading
        }
        tableBody={
          activeTab === 0 ? (
            <AdminProductsTableBody />
          ) : (
            <AdminCategoryTableBody />
          )
        }
        numberOfPages={activeTab == 0 ? numberOfPages : categoryNumOfPages}
        currentPage={activeTab == 0 ? currentPage : categoryCurrentPage}
        handleSelectPage={async (index: number) =>
          activeTab == 0
            ? await dispatch(getAllProducts(index))
            : await dispatch(getAllCategories(index))
        }
        handlePrevPage={async () =>
          activeTab == 0
            ? await dispatch(
                getAllProducts(currentPage > 1 ? currentPage - 1 : currentPage)
              )
            : await dispatch(
                getAllCategories(
                  categoryCurrentPage > 1
                    ? categoryCurrentPage - 1
                    : categoryCurrentPage
                )
              )
        }
        handleNextPage={async () =>
          activeTab == 0
            ? await dispatch(getAllProducts(currentPage + 1))
            : await dispatch(getAllCategories(categoryCurrentPage + 1))
        }
      />
    </div>
  );
};

export default AdminAllProducts;

const productsTableHeading = [
  "Product Id",
  "Products",
  "Category",
  "Price",
  "Action",
];
const categoryTableHeading = ["Category Id", "Category", "Status", "Action"];
