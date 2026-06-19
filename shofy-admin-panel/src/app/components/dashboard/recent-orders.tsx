"use client";
import React, { useState } from "react";
import ErrorMsg from "../common/error-msg";
import TableItem from "./table-item";
import TableHead from "./table-head";
import Pagination from "../ui/Pagination";
import { useGetRecentOrdersQuery } from "@/redux/order/orderApi";
import usePagination from "@/hooks/use-pagination";
import Link from "next/link";

const RecentOrders = () => {
  const { data: recentOrders, isError, isLoading } = useGetRecentOrdersQuery();
  const paginationData = usePagination(recentOrders?.orders || [], 5);
  const { currentItems, handlePageClick, pageCount } = paginationData;

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }

  if (!isLoading && !isError && currentItems) {
    content = (
      <>
        <table className="w-full text-base text-left text-gray-500">
          <TableHead />
          <tbody>
            {currentItems?.map((order) => (
                <TableItem key={order._id} order={order} />
              ))}
          </tbody>
        </table>
        {/*  */}
        <div className="px-4 pt-6 border-t border-gray6">
          <div className="flex flex-col justify-between sm:flex-row pagination">
          <span className="flex items-center uppercase">Showing 1-{currentItems.length} of {recentOrders?.orders.length}</span>
            <Pagination
              handlePageClick={handlePageClick}
              pageCount={pageCount}
            />
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="grid grid-cols-12 gap-6 mb-6">
        <div className="col-span-12 rounded-lg border border-gray6 bg-white p-5 shadow-xs sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="mb-1 text-xl font-semibold text-heading">
                Recent orders
              </h3>
              <p className="mb-0 text-base text-text3">
                Latest customer activity and fulfilment status
              </p>
            </div>
            <Link
              href="/orders"
              className="shrink-0 rounded-md bg-themeLight px-3 py-2 text-tiny font-medium text-theme hover:bg-theme hover:text-white"
            >
              View all orders
            </Link>
          </div>

          {/* table */}
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">{content}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecentOrders;
