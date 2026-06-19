import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import dayjs from "dayjs";
import ErrorMsg from "../common/error-msg";
import { useGetSalesReportQuery } from "@/redux/order/orderApi";

ChartJS.register(
  CategoryScale,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const LineChart = () => {
  const { data: sales, isError, isLoading } = useGetSalesReportQuery();

  if (isLoading) {
    return <div className="h-[300px] animate-pulse rounded-lg bg-gray5" />;
  }

  if (isError || !sales?.salesReport) {
    return <ErrorMsg msg="Sales activity could not be loaded" />;
  }

  const report = sales.salesReport;
  const sevenDayRevenue = report.reduce((sum, entry) => sum + entry.total, 0);
  const sevenDayOrders = report.reduce((sum, entry) => sum + entry.order, 0);
  const averageOrder =
    sevenDayOrders > 0 ? sevenDayRevenue / sevenDayOrders : 0;

  const chartData = {
    labels: report.map((entry) => dayjs(entry.date).format("ddd")),
    datasets: [
      {
        label: "Revenue",
        data: report.map((entry) => entry.total),
        borderColor: "#0989FF",
        backgroundColor: "rgba(9, 137, 255, 0.10)",
        borderWidth: 2.5,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#0989FF",
        pointBorderWidth: 2,
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        displayColors: false,
        callbacks: {
          title: (items: { dataIndex: number }[]) =>
            dayjs(report[items[0].dataIndex].date).format("dddd, MMM D"),
          label: (context: { parsed: { y: number } }) =>
            `Revenue: ${formatCurrency(context.parsed.y)}`,
          afterLabel: (context: { dataIndex: number }) =>
            `Orders: ${report[context.dataIndex].order}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#767A7D" },
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: "#EFF2F5" },
        ticks: {
          color: "#767A7D",
          callback: (value: string | number) =>
            Number(value) >= 1000
              ? `₹${(Number(value) / 1000).toFixed(0)}k`
              : `₹${value}`,
        },
      },
    },
  };

  return (
    <div>
      <div className="mb-6 grid grid-cols-3 gap-3 border-b border-gray6 pb-5">
        <div>
          <p className="mb-1 text-tiny text-text3">7-day revenue</p>
          <p className="mb-0 text-lg font-semibold text-heading">
            {formatCurrency(sevenDayRevenue)}
          </p>
        </div>
        <div>
          <p className="mb-1 text-tiny text-text3">Orders</p>
          <p className="mb-0 text-lg font-semibold text-heading">
            {sevenDayOrders}
          </p>
        </div>
        <div>
          <p className="mb-1 text-tiny text-text3">Average order</p>
          <p className="mb-0 text-lg font-semibold text-heading">
            {formatCurrency(averageOrder)}
          </p>
        </div>
      </div>
      <div className="h-[300px]">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default LineChart;
