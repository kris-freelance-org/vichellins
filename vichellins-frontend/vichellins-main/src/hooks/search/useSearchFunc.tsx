"use client";

import { updateCategoryStateValues } from "@/lib/redux/slices/category/categorySlice";
import { searchCategories } from "@/lib/redux/slices/category/categoryThunk";
import { updateCustomerStateValues } from "@/lib/redux/slices/customers/customerSlice";
import { searchCustomers } from "@/lib/redux/slices/customers/customerThunk";
import { searchOrders } from "@/lib/redux/slices/orders/orderThunk";
import { updateProductStateValues } from "@/lib/redux/slices/products/productSlice";
import { searchProducts } from "@/lib/redux/slices/products/productThunk";
import { updateStaffStateValues } from "@/lib/redux/slices/staff/staffSlice";
import { searchStaffs } from "@/lib/redux/slices/staff/staffThunk";
import { searchTicket } from "@/lib/redux/slices/tickets/ticketThunk";
import { updateTransactionStateValues } from "@/lib/redux/slices/transaction/transactionSlice";
import { searchTransaction } from "@/lib/redux/slices/transaction/transactionThunk";
import { updateStateValues } from "@/lib/redux/slices/userManagmt/userManagmtSlice";
import { AppDispatch } from "@/lib/redux/store";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useSearchFunc = () => {
  const [search, setSearch] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const navigator = useRouter();

  useEffect(() => {
    setSearch("");
  }, [pathname]);
  useEffect(() => {
    if (search.length === 0) {
      clearSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleSearch = async () => {
    if (pathname === "/admin/orders") {
      await dispatch(searchOrders(search));
    } else if (pathname === "/admin/products") {
      await dispatch(searchProducts(search));
    } else if (pathname === "/admin/categories") {
      await dispatch(searchCategories(search));
    } else if (pathname === "/admin/customers") {
      await dispatch(searchCustomers(search));
    } else if (pathname === "/admin/transactions") {
      await dispatch(searchTransaction(search));
    } else if (pathname === "/admin/staffs") {
      await dispatch(searchStaffs(search));
    } else if (pathname === "/admin/tickets") {
      await dispatch(searchTicket(search));
    } else if (pathname === "/admin") {
      if (!search && search.length < 3) return;
      await dispatch(searchOrders(search));
      navigator.push("/admin/orders");
    }
  };

  const submitSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch();
  };

  const clearSearch = () => {
    setSearch("");
    dispatch(updateStateValues({ name: "filteredOrders", value: null }));
    dispatch(updateStaffStateValues({ name: "filteredStaffs", value: null }));
    dispatch(
      updateCustomerStateValues({ name: "filteredCustomers", value: null })
    );
    dispatch(
      updateTransactionStateValues({
        name: "filteredTransactions",
        value: null,
      })
    );

    dispatch(
      updateProductStateValues({ name: "filteredProducts", value: null })
    );
    dispatch(
      updateCategoryStateValues({ name: "filteredCategories", value: null })
    );
  };

  return {
    submitSearch,
    search,
    setSearch,
    handleSearch,
    clearSearch,
  };
};

export default useSearchFunc;
