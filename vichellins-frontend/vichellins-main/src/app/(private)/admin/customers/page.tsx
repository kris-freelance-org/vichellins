"use client"

import CustomerTableBody from "@/components/customers/CustomerTableBody";
import CustomTable from "@/components/shared/CustomTable";
import { getAllCustomers } from "@/lib/redux/slices/customers/customerThunk";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";

// interface AdminAllCustomersProps {}
const AdminAllCustomers: FC = () => {
  const { currentPage, numberOfPages } = useSelector(
    (store: RootState) => store.customer
  );

  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="mt-8 bg-white p-6 rounded-xl border space-y-12">
      <div className="flex flex-col mb-8">
        <h5 className="text-[#3F434A] text-2xl font-manjari font-bold">
          All Customers
        </h5>
        <span className="font-normal text-base">
          Manage your Customers from Here
        </span>
      </div>

      <CustomTable
        headingList={customersTableHeading}
        tableBody={<CustomerTableBody />}
        numberOfPages={numberOfPages}
        currentPage={currentPage}
        handleSelectPage={async (index: number) =>
          await dispatch(getAllCustomers(index))
        }
        handlePrevPage={async () =>
          await dispatch(
            getAllCustomers(currentPage > 1 ? currentPage - 1 : currentPage)
          )
        }
        handleNextPage={async () =>
          await dispatch(getAllCustomers(currentPage + 1))
        }
      />
    </div>
  );
};

export default AdminAllCustomers;

const customersTableHeading = ["User", "Phone Number", "Address", "Action"];
