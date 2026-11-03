import CustomLoader from "@/components/shared/atom/CustomLoader";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useTargetBreakpoint } from "@/hooks/useTargetBreakpoint";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IStaff } from "@/types/staff";
import { deleteStaff, getAllStaffs } from "@/lib/redux/slices/staff/staffThunk";
import UserAvatar from "@/components/shared/atom/UserAvatar";
import { format } from "date-fns";
import { DeleteStaffDialog } from "@/components/admin_staffs/DeleteStaffDialog";
import { toast } from "@/hooks/useToast";
import { AxiosError } from "axios";

type FaqTableBodyProps = object;
const StaffTableBody: FC<FaqTableBodyProps> = () => {
  const [staffData, setStaffData] = useState<IStaff[] | null>(null);
  const { staffList, filteredStaffs, isLoading } = useSelector(
    (store: RootState) => store.staff
  );

  const [isMobile, setIsMobile] = useState(false);
  useTargetBreakpoint({ setIsMobile, breakPoint: 800 });
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getData = async () => {
      try {
        await dispatch(getAllStaffs());
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [dispatch]);

  useEffect(() => {
    if (filteredStaffs) {
      setStaffData(filteredStaffs);
    } else {
      setStaffData(staffList);
    }
  }, [filteredStaffs, dispatch, staffList]);

  const handleDeleteStaff = async (selectedId: number) => {
    try {
      const res = await dispatch(deleteStaff(selectedId));
      if (res.type.includes("rejected")) {
        toast({
          title: "An Error Occurred",
          description: res.payload as string,
          variant: "destructive",
        });

        return null;
      }

      await dispatch(getAllStaffs());

      toast({
        title: "Staff has been Deleted",
        variant: "success",
      });

      return null;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400 || error.response?.status === 401) {
          toast({
            title: "Error Deleting staff",
            description: error.response?.data,
            variant: "destructive",
          });

          return null;
        }
      }

      toast({
        title: "Error Deleting Staff",
        description: "Something went wrong",
        variant: "destructive",
      });
      return null;
    }
  };

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
        staffData &&
        staffData.length > 0 &&
        staffData.map((staff, index) => (
          <TableRow className=" text-base bfaq-b-0" key={index}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell className="font-medium">{staff.id}</TableCell>

            <TableCell>
              <div className="flex gap-3 items-center text-base">
                <UserAvatar
                  imgUrl={"/assets/images/user-profile.png"}
                  name="User"
                />
                <div>
                  <h5 className="font-medium ">{staff.name}</h5>
                  <span className="text-[#4D4C4C]">{staff.email}</span>
                </div>
              </div>
            </TableCell>
            {!isMobile && (
              <>
                <TableCell className="font-medium flex flex-col items-start p-6">
                  <span> {format(staff.createdAt, "dd/LL/yyyy")}</span>
                  <span className="text-[#999999]">
                    {" "}
                    {format(staff.createdAt, "hh:mm aaa")}
                  </span>
                </TableCell>
              </>
            )}
            <TableCell className="relative ">
              <DeleteStaffDialog
                staffId={staff.id}
                isLoading={isLoading}
                handleDeleteStaff={handleDeleteStaff}
              />
            </TableCell>
          </TableRow>
        ))}
      {!isLoading && staffData && staffData.length === 0 && (
        <TableRow>
          <TableCell rowSpan={0}>
            <h4 className="p-8 text-base font-semibold flex justify-center ">
              No Staff Yet
            </h4>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export default StaffTableBody;
