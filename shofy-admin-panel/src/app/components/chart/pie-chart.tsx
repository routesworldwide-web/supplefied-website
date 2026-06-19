import { useGetMostSellingCategoryQuery } from "@/redux/order/orderApi";
import ErrorMsg from "../common/error-msg";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const PieChart = () => {
  const { data, isError, isLoading } = useGetMostSellingCategoryQuery();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-12 animate-pulse rounded-md bg-gray5" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorMsg msg="Category performance could not be loaded" />;
  }

  const categories = data.categoryData;
  const totalRevenue = categories.reduce(
    (sum, category) => sum + category.revenue,
    0
  );
  const highestRevenue = Math.max(
    ...categories.map((category) => category.revenue),
    0
  );

  if (categories.length === 0) {
    return (
      <p className="mb-0 py-10 text-center text-base text-text3">
        Category sales will appear after the first order.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-6 rounded-lg bg-gray5 p-4">
        <p className="mb-1 text-tiny text-text3">Top categories revenue</p>
        <p className="mb-0 text-2xl font-semibold text-heading">
          {formatCurrency(totalRevenue)}
        </p>
      </div>

      <div className="space-y-5">
        {categories.map((category, index) => {
          const width =
            highestRevenue > 0
              ? Math.max((category.revenue / highestRevenue) * 100, 4)
              : 4;

          return (
            <div key={`${category.category}-${index}`}>
              <div className="mb-2 flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <p className="mb-0 truncate text-base font-medium capitalize text-heading">
                    {category.category}
                  </p>
                  <span className="text-tiny text-text3">
                    {category.unitsSold} units sold
                  </span>
                </div>
                <span className="shrink-0 text-base font-semibold text-heading">
                  {formatCurrency(category.revenue)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray">
                <div
                  className="h-full rounded-full bg-theme"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PieChart;
