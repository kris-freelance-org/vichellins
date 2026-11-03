import { FC, ReactNode } from "react";
import TablePaginations from "./TablePaginations";
import { Table } from "../ui/table";
import CustomTableHeader from "./CustomTableHeader";

interface CustomTableProps {
  headingList: string[];
  tableBody: ReactNode;
  numberOfPages: number;
  currentPage: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  handleSelectPage: (number: number) => void;
}

const CustomTable: FC<CustomTableProps> = ({
  headingList,
  tableBody,
  numberOfPages,
  currentPage,
  handlePrevPage,
  handleNextPage,
  handleSelectPage,
}) => {
  return (
    <div>
      <Table className="border-y mb-6  border overflow-hidden  rounded-2xl">
        <CustomTableHeader headingList={headingList} />
        {tableBody}
      </Table>
      <TablePaginations
        numberOfPages={numberOfPages}
        handleSelectPage={handleSelectPage}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
        currentPage={currentPage}
      />
    </div>
  );
};

export default CustomTable;
