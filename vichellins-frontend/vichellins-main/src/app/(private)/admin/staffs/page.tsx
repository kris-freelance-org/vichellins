"use client"

import CustomTable from "@/components/shared/CustomTable";
import { NewStaffDialog } from "@/components/staffs/molecules/NewStaffDialog";
import StaffTableBody from "@/components/staffs/molecules/StaffTableBody";
import { getAllStaffs } from "@/lib/redux/slices/staff/staffThunk";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";

// interface StaffLIstProps {}
const StaffLIst: FC = () => {
  const { currentPage, numberOfPages } = useSelector(
    (store: RootState) => store.staff
  );

  const dispatch = useDispatch<AppDispatch>();
  return (
    <div className="mt-8 bg-white p-6 rounded-xl border space-y-12">
      <div className="flex itenms-center justify-between">
        <div className="flex flex-col mb-8">
          <h5 className="text-[#3F434A] text-2xl font-manjari font-bold">
            All Staffs
          </h5>
          <span className="font-normal text-base">
            Manage your Staffs from Here
          </span>
        </div>

        <div className="flex justify-end">
          <NewStaffDialog />
        </div>
      </div>

      <CustomTable
        headingList={staffTableHeadings}
        tableBody={<StaffTableBody />}
        numberOfPages={numberOfPages}
        currentPage={currentPage}
        handleSelectPage={async (index: number) =>
          await dispatch(getAllStaffs(index))
        }
        handlePrevPage={async () =>
          await dispatch(
            getAllStaffs(currentPage > 1 ? currentPage - 1 : currentPage)
          )
        }
        handleNextPage={async () =>
          await dispatch(getAllStaffs(currentPage + 1))
        }
      />
    </div>
  );
};

export default StaffLIst;

const staffTableHeadings = ["Staff ID", "Staff Info", "Date Created"];
