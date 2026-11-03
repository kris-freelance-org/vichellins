import { FC } from "react";
import { format } from "date-fns";
import { DateRange, DayPicker } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/Button";
import { CalendarIcon } from "lucide-react";
import "react-day-picker/dist/style.css";
import { cn } from "@/lib/utils";

interface DateRangeSelectorProps {
  range?: DateRange;
  setRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  placeholder?: string;
}

const DateRangeSelector: FC<DateRangeSelectorProps> = ({
  range,
  placeholder,
  setRange,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-fit justify-start text-left font-normal",
            !range && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-[1.6rem] w-[1.6rem]" />
          {range?.to && range?.from ? (
            <div className="space-x-4">
              {format(range.from, "MMM, dd")} - {format(range.to, "MMM, dd")}
            </div>
          ) : (
            <span>{placeholder || "Pick a Date"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <DayPicker className="text-base" mode="range" selected={range} onSelect={setRange} />;
      </PopoverContent>
    </Popover>
  );
};

export default DateRangeSelector;
