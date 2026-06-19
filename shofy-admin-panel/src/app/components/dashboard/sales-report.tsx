"use client";
import React from "react";
import LineChart from "../chart/line-chart";
import PieChart from "../chart/pie-chart";

const SalesReport = () => {
 
  return (
    <>
      <div className="chart-main-wrapper mb-6 grid grid-cols-12 gap-5">
        <div className="col-span-12 xl:col-span-8">
          <div className="h-full rounded-lg border border-gray6 bg-white p-5 shadow-xs sm:p-7">
            <div className="mb-6">
              <h3 className="mb-1 text-xl font-semibold text-heading">
                Revenue trend
              </h3>
              <p className="mb-0 text-base text-text3">
                Daily non-cancelled sales from the last seven days
              </p>
            </div>
            <LineChart/>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-4">
          <div className="h-full rounded-lg border border-gray6 bg-white p-5 shadow-xs sm:p-7">
            <div className="mb-6">
              <h3 className="mb-1 text-xl font-semibold text-heading">
                Best-selling categories
              </h3>
              <p className="mb-0 text-base text-text3">
                Ranked by actual product revenue
              </p>
            </div>
            <PieChart/>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesReport;
