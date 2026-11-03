import DateRangeSelector from "@/components/admin_shared/DateRangeSelector";
import AreaChart from "@/components/charts/AreaChart";
import CustomLoader from "@/components/shared/atom/CustomLoader";
import { toast } from "@/hooks/useToast";
import {
  getPeriodsOrdersPerDay,
  getPeriodsTotalOrders,
} from "@/lib/redux/slices/analytics/analyticsThunk";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { AxiosError } from "axios";
import { format, subDays } from "date-fns";
import { FC, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { GoDotFill } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";

const initData = {
  labels: [],
  datasets: [
    {
      label: "Orders",
      data: [],
      backgroundColor: "#42b40521",
      borderColor: "#41B405",
      fill: true,
      tension: 0.4,
    },
  ],
};
// interface OrderAnalyticsProps {}
const OrderAnalytics: FC = () => {
  const [periodsLabel, setPeriodsLabel] = useState<string[]>([]);
  const [periodData, setPeriodData] = useState<number[]>([]);

  const initialRange: DateRange = {
    from: subDays(new Date(), 7),
    to: new Date(),
  };

  const [range, setRange] = useState<DateRange | undefined>(initialRange);

  const { periodsOrdersPerDay, periodsTotalOrder } = useSelector(
    (store: RootState) => store.analytics
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getData = async () => {
      try {
        if (range && range.from && range.to) {
          await dispatch(
            getPeriodsOrdersPerDay({
              start_date: format(range?.from, "yyy-M-d"),
              end_date: format(range?.to, "yyy-M-d"),
            })
          );
          await dispatch(
            getPeriodsTotalOrders({
              start_date: format(range?.from, "yyy-M-d"),
              end_date: format(range?.to, "yyy-M-d"),
            })
          );
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          if (
            error.response?.status === 400 ||
            error.response?.status === 401
          ) {
            return toast({
              title: "Error Geting Data",
              description: error.response?.data,
              variant: "destructive",
            });
          }
        }

        toast({
          title: "Error Geting Data",
          description: "Something went wrong",
          variant: "destructive",
        });
      }
    };

    getData();
  }, [dispatch, range]);

  useEffect(() => {
    if (periodsOrdersPerDay) {
      setPeriodsLabel(Object.keys(periodsOrdersPerDay).map((label) => label));
      setPeriodData(
        Object.values(periodsOrdersPerDay).map((label) => label.count ?? 0)
      );
    }
  }, [periodsOrdersPerDay]);
  return (
    <div className="border rounded-2xl p-8">
      <div className="flex justify-between">
        <div className="flex flex-col mb-8">
          <h5 className="text-[#3F434A] text-2xl font-manjari font-bold">
            Order Analytics
          </h5>
          <span className="font-normal text-base">
            Orders made during the selected period
          </span>
        </div>
        <DateRangeSelector
          range={range}
          setRange={setRange}
          placeholder={"Select a date Range "}
        />
      </div>
      <div className="flex flex-col items-end flex-end">
        {initData.datasets?.map((data, index) => (
          <div key={index} className="flex gap-3 items-center w-[14rem]">
            <GoDotFill size={16} color={data.borderColor as string} />

            <span className="text-base">
              {data.label}: {periodsTotalOrder}
            </span>
          </div>
        ))}
      </div>
      {periodsOrdersPerDay ? (
        <AreaChart
          aspRatio={4}
          chartData={{
            labels: periodsLabel,
            datasets: [
              {
                label: "Orders per day",
                data: periodData,
                backgroundColor: "#42b40521",
                borderColor: "#41B405",
                borderWidth: 3,
                borderCapStyle: "round",
                pointRadius: 0,
                pointHoverRadius: 10,
                pointHoverBackgroundColor: "#347AE2",
                pointHoverBorderColor: "#ffffff",
                pointHoverBorderWidth: 2,
                fill: true,
                tension: 0.4,
              },
            ],
          }}
        />
      ) : (
        <CustomLoader height={40} width={40} />
      )}
    </div>
  );
};

export default OrderAnalytics;
