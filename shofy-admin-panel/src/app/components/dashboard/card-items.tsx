"use client";

import React from "react";
import { MonthSales, Received, Sales, TotalOrders } from "@/svg";
import { useGetDashboardAmountQuery } from "@/redux/order/orderApi";
import ErrorMsg from "../common/error-msg";

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

type CardItemProps = {
  title: string;
  value: string;
  detail: string;
  comparison?: string;
  comparisonTone?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  iconClass: string;
};

function CardItem({
  title,
  value,
  detail,
  comparison,
  comparisonTone = "neutral",
  icon,
  iconClass,
}: CardItemProps) {
  const comparisonClass =
    comparisonTone === "positive"
      ? "text-success bg-success/10"
      : comparisonTone === "negative"
      ? "text-danger bg-danger/10"
      : "text-text3 bg-gray";

  return (
    <article className="relative overflow-hidden rounded-lg border border-gray6 bg-white p-6 shadow-xs transition-transform duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="mb-3 text-tiny font-medium uppercase tracking-[0.12em] text-text3">
            {title}
          </p>
          <h3 className="mb-2 truncate text-[26px] font-semibold leading-none text-heading">
            {value}
          </h3>
          <p className="mb-0 text-base text-textBody">{detail}</p>
        </div>
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
        >
          {icon}
        </span>
      </div>

      {comparison && (
        <div className="mt-5 border-t border-gray6 pt-4">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${comparisonClass}`}
          >
            {comparison}
          </span>
        </div>
      )}
    </article>
  );
}

const CardItems = () => {
  const { data, isError, isLoading } = useGetDashboardAmountQuery();

  if (isLoading) {
    return (
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[174px] animate-pulse rounded-lg bg-white"
          />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorMsg msg="Dashboard totals could not be loaded" />;
  }

  const todayOrderCount = Number(data.todayOrderCount || 0);
  const yesterdayOrderCount = Number(data.yesterdayOrderCount || 0);
  const monthlyOrderCount = Number(data.monthlyOrderCount || 0);
  const totalOrderCount = Number(data.totalOrderCount || 0);
  const yesterdayRevenue = data.yesterdayOrderAmount || 0;
  const revenueChange =
    yesterdayRevenue > 0
      ? ((data.todayOrderAmount - yesterdayRevenue) / yesterdayRevenue) * 100
      : data.todayOrderAmount > 0
      ? 100
      : 0;
  const revenueChangeLabel = `${Math.abs(revenueChange).toFixed(
    0
  )}% ${revenueChange >= 0 ? "above" : "below"} yesterday`;

  return (
    <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <CardItem
        title="Today's revenue"
        value={formatCurrency(data.todayOrderAmount)}
        detail={`${todayOrderCount} ${
          todayOrderCount === 1 ? "order" : "orders"
        } received`}
        comparison={revenueChangeLabel}
        comparisonTone={revenueChange > 0 ? "positive" : revenueChange < 0 ? "negative" : "neutral"}
        icon={<Received />}
        iconClass="bg-success/10 text-success"
      />
      <CardItem
        title="Today's orders"
        value={todayOrderCount.toLocaleString("en-IN")}
        detail={`${formatCurrency(data.todayCashPaymentAmount)} COD · ${formatCurrency(
          data.todayCardPaymentAmount
        )} online`}
        comparison={`${yesterdayOrderCount} orders yesterday`}
        icon={<Sales />}
        iconClass="bg-purple/10 text-purple"
      />
      <CardItem
        title="This month"
        value={formatCurrency(data.monthlyOrderAmount)}
        detail={`${monthlyOrderCount.toLocaleString(
          "en-IN"
        )} non-cancelled orders`}
        icon={<MonthSales />}
        iconClass="bg-info/10 text-info"
      />
      <CardItem
        title="Lifetime revenue"
        value={formatCurrency(data.totalOrderAmount)}
        detail={`${totalOrderCount.toLocaleString(
          "en-IN"
        )} completed or active orders`}
        icon={<TotalOrders />}
        iconClass="bg-warning/10 text-warning"
      />
    </div>
  );
};

export default CardItems;
