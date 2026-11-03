
import { convertToShortScale } from "@/kits/helpers/convertToShortScale";
import { createDashboardChartTooltip } from "@/kits/helpers/createChartTooltip";
import {
  Chart,
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
  Title,
} from "chart.js";
import { ChartData } from "chart.js";
import { FC } from "react";
import { Line } from "react-chartjs-2";

interface AreaChartProps {
  chartData: ChartData<"line">;
  aspRatio?: number;
  stepSz?: number;
  xLable?: string;
  yLable?: string;
}

Chart.register(
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
  Title
);

const AreaChart: FC<AreaChartProps> = ({
  chartData,
  aspRatio,
  xLable,
  yLable,
}) => {
  return (
    <Line
      data={chartData}
      options={{
        aspectRatio: aspRatio || 2,
        font: {
          family: "'Manrope', 'Helvetica', 'Arial', sans-serif",
        },

        scales: {
          x: {
            title: {
              text: xLable,
              display: xLable ? true : false,
              font: {
                weight: 700,
                size: 16,
              },
            },
            beginAtZero: false,
            ticks: {
              font: {
                size: 14,
                weight: 400,
              },
            },
          },
          y: {
            border: {
              display: false,
            },

            beginAtZero: true,
            grid: {
              drawTicks: false,

              display: false,
            },
            title: {
              text: yLable,
              display: yLable ? true : false,
              font: {
                weight: 700,
                size: 16,
              },
            },
            ticks: {
              font: {
                size: 14,
                weight: 400,
              },
              maxTicksLimit: 6,
              autoSkip: true,
              callback: function (value) {
                return convertToShortScale(value as number);
              },
            },
          },
        },

        plugins: {
          legend: {
            display: false,
          },

          tooltip: {
            enabled: false,
            caretSize: 10,
            external: createDashboardChartTooltip,
          },
        },
      }}
    />
  );
};

export default AreaChart;
