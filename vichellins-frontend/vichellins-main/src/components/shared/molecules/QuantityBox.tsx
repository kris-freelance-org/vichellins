import { Separator } from "@/components/ui/separator";
import { FC } from "react";

interface QuantityBoxProps {
  handleDecrement: () => void;
  handleIncrement: () => void;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  quantity: number;
  hideText?: boolean;
  isLoading?: boolean;
}
const QuantityBox: FC<QuantityBoxProps> = ({
  handleDecrement,
  handleIncrement,
  setQuantity,
  quantity,
  hideText,
  isLoading,
}) => {
  return (
    <div className="flex gap-8 items-center ">
      {!hideText && <h6 className="text-base font-semibold">Quantity</h6>}
      <div className="h-[3.2rem] border rounded-xl flex items-center gap-3">
        <button
          disabled={isLoading}
          onClick={handleDecrement}
          className="font-bold text-2xl w-16 disabled:text-gray-400"
        >
          -
        </button>
        <Separator orientation="vertical" />
        <input
          type="text"
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="w-16 border-none outline-none text-base text-center"
          value={quantity}
        />
        <Separator orientation="vertical" />
        <button
          disabled={isLoading}
          onClick={handleIncrement}
          className="font-bold text-2xl w-16 disabled:text-gray-400"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantityBox;
