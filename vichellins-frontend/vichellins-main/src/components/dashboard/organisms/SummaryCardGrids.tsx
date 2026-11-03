import { FC, useEffect } from "react";
import SummaryCard from "../molecules/SummaryCard";
import { Boxes, ShoppingCart, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "@/hooks/useToast";
import { getAnalytics } from "@/lib/redux/slices/analytics/analyticsThunk";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { AxiosError } from "axios";

// interface SummaryCardGridsProps {}
const SummaryCardGrids: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { analytics } = useSelector((store: RootState) => store.analytics);
 
  console.log(analytics, "analytics")
 
  useEffect(() => {
    const getData = async () => {
      try {
        await dispatch(getAnalytics());
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
  }, [dispatch]);

  return (
    <div className={"grid gap-6  grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 "}>
     

      <SummaryCard
        icon={<Users size={18}  />}
        text="Customers"
        value={analytics?.totalUsers}
      />

      <SummaryCard
        icon={<ShoppingCart size={18}  />}
        text="Orders"
        value={analytics?.totalOrders}
      />
      <SummaryCard
        icon={<Boxes size={18}  />}
        text="Products"
        value={analytics?.totalProducts}
      />
    </div>
  );
};

export default SummaryCardGrids;
