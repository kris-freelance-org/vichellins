"use cleint";

import { getSingleCustomers } from "@/lib/redux/slices/customers/customerThunk";
import { AppDispatch } from "@/lib/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetSingleCustomer = ({ customerId }: { customerId: string | string[] | undefined }) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getData = async () => {
      if (!customerId) return;

      try {
        await dispatch(getSingleCustomers(customerId as string));
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);
};

export default useGetSingleCustomer;
