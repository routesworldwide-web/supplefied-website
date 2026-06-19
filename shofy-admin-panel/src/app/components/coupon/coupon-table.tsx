import React from "react";
import Image from "next/image";
import dayjs from "dayjs";
// internal
import Loading from "../common/loading";
import ErrorMsg from "../common/error-msg";
import CouponAction from "./coupon-action";
import {
  useEditCouponMutation,
  useGetAllCouponsQuery,
} from "@/redux/coupon/couponApi";
import Pagination from "../ui/Pagination";
import usePagination from "@/hooks/use-pagination";
import { notifyError, notifySuccess } from "@/utils/toast";

// table head
function TableHead({ title }: { title: string }) {
  return (
    <th
      scope="col"
      className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[170px] text-end"
    >
      {title}
    </th>
  );
}

// prop type
type IPropType = {
  cls?: string;
  setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  selectValue?: string;
  searchValue?: string;
};

const CouponTable = ({cls,setOpenSidebar,selectValue,searchValue}: IPropType) => {
  const { data: coupons, isError, isLoading, error } = useGetAllCouponsQuery();
  const [editCoupon, { isLoading: isUpdatingStatus }] = useEditCouponMutation();
  const paginationData = usePagination(coupons || [], 5);
  const { currentItems, handlePageClick, pageCount } = paginationData;

  const handleStatusToggle = async (
    id: string,
    currentStatus: "active" | "inactive"
  ) => {
    const status = currentStatus === "active" ? "inactive" : "active";

    try {
      await editCoupon({ id, data: { status } }).unwrap();
      notifySuccess(`Coupon marked ${status}`);
    } catch {
      notifyError("Coupon status could not be updated");
    }
  };
  // decide to render
  let content = null;
  if (isLoading) {
    content = <Loading loading={isLoading} spinner="bar" />;
  }
  if (isError && !coupons) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isError && coupons) {
    let coupon_items = [...currentItems];
    // search value filtering if search value true
    if (searchValue) {
      coupon_items = coupon_items.filter((c) =>
        c.title.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    // selectValue filtering if selectValue true
    if (selectValue) {
      coupon_items = coupon_items.filter(
        (c) =>
          (c.status || "active").toLowerCase() === selectValue.toLowerCase()
      );
    }
    content = (
      <>
        <table className="w-full text-base text-left text-gray-500">
          <thead className="bg-white">
            <tr className="border-b border-gray6 text-tiny">
              <th
                scope="col"
                className="pr-8 py-3 text-tiny text-text2 uppercase font-semibold"
              >
                Name
              </th>
              <TableHead title="Code" />
              <TableHead title="Amount" />
              <TableHead title="Status" />
              <TableHead title="Start" />
              <TableHead title="End" />
              <th
                scope="col"
                className="px-9 py-3 text-tiny text-text2 uppercase  font-semibold w-[12%] text-end"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {coupon_items.map((coupon) => (
                <tr
                  key={coupon._id}
                  className="bg-white border-b border-gray6 last:border-0 text-start mx-9"
                >
                  <td className="pr-8 py-5 whitespace-nowrap">
                    <div className="flex items-center space-x-5">
                      {coupon?.logo && (
                        <Image
                          className="w-[60px] h-[60px] rounded-md"
                          src={coupon.logo}
                          alt="logo"
                          width={60}
                          height={60}
                        />
                      )}
                      <span className="font-medium text-heading">
                        {coupon.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-black font-normal text-end">
                    <span className="uppercase rounded-md px-3 py-1 bg-gray">
                      {coupon.couponCode}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                    {coupon.discountPercentage}%
                  </td>
                  <td className="px-3 py-3 text-end">
                    <button
                      type="button"
                      disabled={isUpdatingStatus}
                      onClick={() =>
                        handleStatusToggle(
                          coupon._id,
                          coupon.status || "active"
                        )
                      }
                      className="inline-flex items-center justify-end gap-2 whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label={`Mark ${coupon.title} ${
                        coupon.status === "inactive" ? "active" : "inactive"
                      }`}
                    >
                      <span
                        className={`relative inline-flex h-6 w-11 items-center rounded-full border border-black shadow-sm transition-colors duration-200 ${
                          coupon.status !== "inactive" &&
                          !dayjs().isAfter(dayjs(coupon.endTime))
                            ? "bg-success"
                            : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 rounded-full border border-black bg-white shadow-md transition-transform duration-200 ${
                            coupon.status !== "inactive"
                              ? "translate-x-5"
                              : "translate-x-1"
                          }`}
                        />
                      </span>
                      <span
                        className={`text-[11px] font-medium ${
                          coupon.status === "inactive" ||
                          dayjs().isAfter(dayjs(coupon.endTime))
                            ? "text-danger"
                            : "text-success"
                        }`}
                      >
                        {dayjs().isAfter(dayjs(coupon.endTime))
                          ? "Expired"
                          : coupon.status === "inactive"
                          ? "Inactive"
                          : "Active"}
                      </span>
                    </button>
                  </td>

                  <td className="px-3 py-3 text-end">
                    {dayjs(coupon.createdAt).format("MMM D, YYYY")}
                  </td>
                  <td className="px-3 py-3 text-end">
                    {dayjs(coupon.endTime).format("MMM D, YYYY")}
                  </td>
                  <td className="px-9 py-3 text-end">
                    <CouponAction
                      id={coupon._id}
                      setOpenSidebar={setOpenSidebar}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

          <div className="flex justify-between items-center flex-wrap mx-8">
            <p className="mb-0 text-tiny">
              Showing 1-
              {
                currentItems.length
              }{" "}
              of {coupons?.length}
            </p>
            <div className="pagination py-3 flex justify-end items-center mx-8 pagination">
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
    <div className={`${cls ? cls : "relative overflow-x-auto mx-8"}`}>
      {content}
    </div>
  );
};

export default CouponTable;
