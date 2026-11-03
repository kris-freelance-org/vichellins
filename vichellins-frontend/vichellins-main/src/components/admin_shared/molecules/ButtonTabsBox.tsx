import { FC } from "react";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

interface ButtonTabsBoxProps {
  tabs: string[];
  btnOnclick: (index: number) => void;
  activeIndex: number;
}

const ButtonTabsBox: FC<ButtonTabsBoxProps> = ({
  tabs,
  btnOnclick,
  activeIndex,
}) => {
  return (
    <>
      <div className="hidden lg:block ">
        {tabs.map((tab, index) => (
          <Button
            key={index}
            onClick={() => btnOnclick(index)}
            variant={"ghost"}
            className={`h-24 capitalize hover:bg-transparent border-b-4 border-transparent rounded-none hover:border-[hsl(138,63%,36%)] ${
              index === activeIndex && "border-[hsl(138,63%,36%)]"
            }`}
          >
            {tab}
          </Button>
        ))}
        <hr />
      </div>
      <div className="block w-full lg:hidden ">
        <Select  defaultValue={"0"} onValueChange={(index) => btnOnclick(Number(index))}>
          <SelectTrigger  className="focus-visible:ring-0 focus-visible:ring-offset-0 ">
            <SelectValue placeholder="-Select State-" />
          </SelectTrigger>
          <SelectContent>
            {tabs.map((item, index) => (
              <SelectItem
                key={index}
                value={index.toString()}
                className="capitalize"
              >
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default ButtonTabsBox;
