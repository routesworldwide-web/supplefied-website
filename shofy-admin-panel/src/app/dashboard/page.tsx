import Wrapper from "@/layout/wrapper";
import CardItems from "../components/dashboard/card-items";
import SalesReport from "../components/dashboard/sales-report";
import RecentOrders from "../components/dashboard/recent-orders";
import dayjs from "dayjs";

export default function DashboardPage() {
  return (
    <Wrapper>
      <div className="body-content min-h-screen bg-slate-100 px-5 py-7 sm:px-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div className="page-title">
            <p className="mb-2 text-tiny font-medium uppercase tracking-[0.16em] text-theme">
              Store overview
            </p>
            <h1 className="mb-2 text-4xl font-semibold text-heading">
              Dashboard
            </h1>
            <p className="m-0 text-textBody">
              Revenue, orders, and category performance at a glance.
            </p>
          </div>
          <div className="rounded-full border border-gray6 bg-white px-4 py-2 text-tiny font-medium text-textBody shadow-xs">
            Updated {dayjs().format("MMM D, YYYY")}
          </div>
        </div>

        {/* card item start  */}
        <CardItems />
        {/* card item end  */}

        {/* chart start */}
        <SalesReport />
        {/* chart end */}

        {/* recent orders start */}
        <RecentOrders />
        {/* recent orders end */}
      </div>
    </Wrapper>
  );
}
