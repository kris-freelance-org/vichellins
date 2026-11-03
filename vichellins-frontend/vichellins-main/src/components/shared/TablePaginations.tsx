import { Button } from "../ui/Button";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { IoIosArrowRoundForward } from "react-icons/io";
import { FC } from "react";

interface TablePaginationsProps {
  numberOfPages: number;
  currentPage: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  handleSelectPage: (number: number) => void;
}
const TablePaginations: FC<TablePaginationsProps> = ({
  currentPage,
  numberOfPages,
  handlePrevPage,
  handleSelectPage,
  handleNextPage,
}) => {
  return (
    <div className=" flex items-center justify-between  ">
      <Button
        disabled={currentPage === 1}
        variant={"outline"}
        onClick={() => handlePrevPage()}
        className="bg-transparent flex gap-2 items-center"
      >
        <MdOutlineKeyboardBackspace />
        Previous
      </Button>
      <div>
        {currentPage < 5 ? (
          [...Array(numberOfPages).keys()].slice(0, 5).map((_, index) => (
            <Button
              onClick={() => handleSelectPage(index + 1)}
              key={index}
              variant={currentPage === index + 1 ? "default" : "ghost"}
            >
              {index + 1}
            </Button>
          ))
        ) : currentPage > 5 && currentPage < numberOfPages - 3 ? (
          <>
            <Button
              onClick={() => handleSelectPage(1)}
              variant={currentPage === 1 ? "default" : "ghost"}
            >
              {1}
            </Button>
            <span>...</span>
            {createArrayFrom(currentPage - 2, 6).map((item, index) => (
              <Button
                onClick={() => handleSelectPage(item)}
                key={index}
                variant={currentPage === item ? "default" : "ghost"}
              >
                {item}
              </Button>
            ))}
          </>
        ) : (
          <>
            <span>...</span>
            {createArrayFrom( currentPage - (5 - (numberOfPages - currentPage)), 6).map(
              (item, index) => (
                <Button
                  onClick={() => handleSelectPage(item)}
                  key={index}
                  variant={currentPage === item ? "default" : "ghost"}
                >
                  {item}
                </Button>
              )
            )}
          </>
        )}
        {currentPage + 3 < numberOfPages &&
          [...Array(numberOfPages).keys()].slice(-1).map((_, index) => (
            <>
              <span>...</span>
              <Button
                disabled={currentPage === numberOfPages}
                onClick={() =>
                  handleSelectPage([...Array(numberOfPages).keys()].length)
                }
                key={index}
                variant={"ghost"}
              >
                {[...Array(numberOfPages).keys()].length}
              </Button>
            </>
          ))}
      </div>
      <Button
      disabled={currentPage === numberOfPages}
        variant={"outline"}
        onClick={() => handleNextPage()}
        className="bg-transparent flex gap-2 items-center"
      >
        Next <IoIosArrowRoundForward />
      </Button>
    </div>
  );
};

export default TablePaginations;

function createArrayFrom(start: number, numberOfItems: number) {
  return Array(numberOfItems)
    .fill(0)
    .map((_, i) => start + i);
}
