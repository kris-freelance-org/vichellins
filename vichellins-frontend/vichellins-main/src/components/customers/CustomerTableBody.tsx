import { FC, useEffect, useState } from "react";
import CustomLoader from "@/components/shared/atom/CustomLoader";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useTargetBreakpoint } from "@/hooks/useTargetBreakpoint";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { useDispatch, useSelector } from "react-redux";
import CustomerTablePopOver from "./CustomerTablePopOver";
import { getAllCustomers } from "@/lib/redux/slices/customers/customerThunk";
import { ICustomer } from "@/types/customers";
import UserAvatar from "../shared/atom/UserAvatar";

type CustomerTableBodyProps = object;
const CustomerTableBody: FC<CustomerTableBodyProps> = () => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );
  const [customersData, setCustomersData] = useState<ICustomer[] | null>(null);
  const { filteredCustomers, customers, isLoading } = useSelector(
    (store: RootState) => store.customer
  );

  const [isMobile, setIsMobile] = useState(false);
  useTargetBreakpoint({ setIsMobile, breakPoint: 800 });
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getData = async () => {
      try {
        await dispatch(getAllCustomers());
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [dispatch]);

  useEffect(() => {
    if (filteredCustomers) {
      setCustomersData(filteredCustomers);
    } else {
      setCustomersData(customers);
    }
  }, [customers, filteredCustomers]);

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
        customersData &&
        customersData.length > 0 &&
        customersData.map((customer, index) => (
          <TableRow className=" text-base bcustomer-b-0" key={index}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>
              <div className="flex gap-3 items-center text-base">
                <UserAvatar
                  imgUrl={"/assets/images/user-profile.png"}
                  name="User"
                />
                <div>
                  <h5 className="font-medium ">{customer.name}</h5>
                  <span className="text-[#4D4C4C]">{customer.email}</span>
                </div>
              </div>
            </TableCell>
            {!isMobile && (
              <>
                <TableCell className="font-medium p-6">
                  {customer.phone || "N/A"}
                </TableCell>
                <TableCell className="font-medium flex flex-col items-start p-6">
                  <span className="text-[#999999]">
                    {customer.street || "N/A"}
                  </span>
                </TableCell>
              </>
            )}
            <TableCell
              onClick={() => {
                setSelectedCustomerId(customer.id);
              }}
              className="relative"
            >
              <CustomerTablePopOver selectedId={selectedCustomerId} />
            </TableCell>
          </TableRow>
        ))}
      {!isLoading && customersData && customersData.length === 0 && (
        <TableRow>
          <TableCell rowSpan={0}>
            <h4 className="p-8 text-base font-semibold flex justify-center ">
              No Customer to display
            </h4>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export default CustomerTableBody;
