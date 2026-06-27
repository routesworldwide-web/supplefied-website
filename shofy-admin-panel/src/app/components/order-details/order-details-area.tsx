"use client";
import dayjs from "dayjs";
import React, { useRef } from "react";
import ErrorMsg from "../common/error-msg";
import { useGetSingleOrderQuery } from "@/redux/order/orderApi";
import { Invoice } from "@/svg";
import { useReactToPrint } from "react-to-print";
import { notifyError } from "@/utils/toast";
import {
  formatDiscountPercent,
  formatPrice,
  getCartTotals,
  getLinePricing,
} from "@/utils/pricing";

const getBillingAddress = (orderData: {
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;
}) =>
  [orderData.address, orderData.city, orderData.country]
    .filter(Boolean)
    .join(", ") + (orderData.zipCode ? ` - ${orderData.zipCode}` : "");

const OrderDetailsArea = ({ id }: { id: string }) => {
  const { data: orderData, isLoading, isError } = useGetSingleOrderQuery(id, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });
  const printRef = useRef<HTMLDivElement | null>(null);

  let content = null;

  if (isLoading) {
    content = <h2>Loading....</h2>;
  }

  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }

  if (!isLoading && !isError && orderData) {
    const cartTotals = getCartTotals(orderData.cart);
    const couponDiscount = Number(orderData.discount || 0);
    const totalDiscount = cartTotals.productDiscount + couponDiscount;

    const couponSummary = orderData.coupon?.couponCode
      ? `${orderData.coupon.couponCode} - ${formatDiscountPercent(
          orderData.coupon.discountPercentage
        )} off Supplefied`
      : null;

    content = (
      <div className="container mx-auto grid px-6">
        <h1 className="my-6 text-lg font-bold text-gray-700 dark:text-gray-300 print:hidden">
          Invoice
        </h1>

        <div ref={printRef} className="bg-white print:bg-white">
          <div className="mx-auto w-full max-w-100% border border-gray-300 bg-white text-[#111] shadow-sm print:w-[190mm] print:max-w-[190mm] print:border-gray-300 print:shadow-none">
            <div className="px-8 py-8 print:px-7 print:py-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-10 border-b border-gray-300 pb-8 print:pb-6">
                <div>
                  <h1 className="mb-1 text-[34px] font-extrabold leading-none tracking-[1px] text-gray-950 print:text-[30px]">
                    Supplef<span className="text-[#E4D329]">i</span>ed
                  </h1>
                  <p className="mb-7 text-[15px] text-gray-700 print:mb-5 print:text-[13px]">
                    Supplements. Simplified.
                  </p>

                  <p className="text-[12px] leading-[1.65] text-gray-700 print:text-[11px]">
                    400-A Ajit Singh House, Yusuf Sarai
                    <br />
                    Commercial Complex,
                    <br />
                    Green Park Metro Station - 110016
                  </p>
                </div>

                <div className="text-right">
                  <h2 className="mb-9 text-[30px] font-extrabold tracking-[0.12em] text-[#E4D329] print:mb-7 print:text-[26px]">
                    INVOICE
                  </h2>

                  <div className="space-y-2 text-[12px] leading-relaxed text-gray-800 print:text-[11px]">
                    <p>
                      <strong>Invoice ID:</strong> #{orderData.invoice}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {dayjs(orderData.createdAt).format("MMMM D, YYYY")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bill To */}
              <div className="py-7 text-[12px] leading-[1.75] print:py-5 print:text-[11px]">
                <p className="mb-2">
                  <span className="font-extrabold uppercase text-black ">
                    Bill To :
                  </span>{" "}
                  <strong className="uppercase">{orderData.name}</strong>
                </p>

                <p>
                  <span className="font-extrabold text-black">
                    Address :
                  </span>{" "}
                  {getBillingAddress(orderData)}
                </p>

                <p>
                  <span className="font-extrabold text-black">
                    Mobile Number :
                  </span>{" "}
                  {orderData.contact}
                </p>
              </div>

              <div
                className={`mb-7 rounded-md border px-4 py-4 print:mb-5 ${
                  orderData.status === "cancel"
                    ? "border-danger/30 bg-danger/5"
                    : "border-gray6 bg-gray5"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-text3">
                      Order status
                    </p>
                    <p
                      className={`mb-0 text-base font-semibold capitalize ${
                        orderData.status === "cancel"
                          ? "text-danger"
                          : "text-heading"
                      }`}
                    >
                      {orderData.status === "cancel"
                        ? "Cancelled"
                        : orderData.status}
                    </p>
                  </div>

                  {orderData.cancellation && (
                    <>
                      <div className="max-w-[360px]">
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-text3">
                          Cancellation reason
                        </p>
                        <p className="mb-0 text-base text-heading">
                          {orderData.cancellation.reason || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-text3">
                          Cancelled by
                        </p>
                        <p className="mb-0 text-base capitalize text-heading">
                          {orderData.cancellation.cancelledBy || "Unknown"}
                          {orderData.cancellation.cancelledAt
                            ? ` · ${dayjs(
                                orderData.cancellation.cancelledAt
                              ).format("MMM D, YYYY h:mm A")}`
                            : ""}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-text3">
                          Refund
                        </p>
                        <p
                          className={`mb-0 text-base font-medium capitalize ${
                            orderData.cancellation.refundStatus === "pending"
                              ? "text-warning"
                              : "text-heading"
                          }`}
                        >
                          {orderData.cancellation.refundStatus
                            ?.replaceAll("_", " ") || "Not required"}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Product Table */}
              <div className="overflow-hidden border border-gray-300">
                <table className="w-full border-collapse text-[11px] print:text-[10px]">
                  <thead>
                    <tr className="bg-[#fbfdf8] text-black">
                      <th className="w-[6%] border-r border-gray-300 px-3 py-3 text-center font-extrabold uppercase">
                        #
                      </th>
                      <th className="w-[34%] border-r border-gray-300 px-3 py-3 text-left font-extrabold uppercase">
                        Product Name
                      </th>
                      <th className="w-[10%] border-r border-gray-300 px-3 py-3 text-center font-extrabold uppercase">
                        Qty
                      </th>
                      <th className="w-[16%] border-r border-gray-300 px-3 py-3 text-center font-extrabold uppercase">
                        Unit Price
                      </th>
                      <th className="w-[18%] border-r border-gray-300 px-3 py-3 text-center font-extrabold uppercase">
                        Discount
                      </th>
                      <th className="w-[16%] px-3 py-3 text-right font-extrabold uppercase">
                        Amount
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {orderData.cart.map((item, index) => {
                      const pricing = getLinePricing(item);

                      return (
                        <tr key={item._id || index} className="border-t border-gray-300">
                          <td className="border-r border-gray-300 px-3 py-3 text-center">
                            {index + 1}
                          </td>
                          <td className="border-r border-gray-300 px-3 py-3">
                            {item.title}
                          </td>
                          <td className="border-r border-gray-300 px-3 py-3 text-center">
                            {pricing.quantity}
                          </td>
                          <td className="border-r border-gray-300 px-3 py-3 text-center">
                            {formatPrice(pricing.originalPrice)}
                          </td>
                          <td className="border-r border-gray-300 px-3 py-3 text-center">
                            {pricing.discountPercent > 0
                              ? `${formatDiscountPercent(
                                  pricing.discountPercent
                                )} (${formatPrice(pricing.lineDiscount)})`
                              : formatPrice(0)}
                          </td>
                          <td className="px-3 py-3 text-right">
                            {formatPrice(pricing.lineTotal)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="mt-8 grid grid-cols-[1fr_1fr_1fr_1.08fr] border border-gray-300 print:mt-6">
                <div className="min-h-[90px] border-r border-gray-300 px-3 py-5 text-center print:min-h-[75px] print:py-4">
                  <h5 className="mb-4 text-[11px] font-extrabold uppercase text-black print:mb-3 print:text-[10px]">
                    Payment Method
                  </h5>
                  <p className="text-[18px] font-extrabold uppercase print:text-[16px]">
                    {orderData.paymentMethod}
                  </p>
                </div>

                <div className="min-h-[90px] border-r border-gray-300 px-3 py-5 text-center print:min-h-[75px] print:py-4">
                  <h5 className="mb-4 text-[11px] font-extrabold uppercase text-black print:mb-3 print:text-[10px]">
                    Shipping Cost
                  </h5>
                  <p className="text-[18px] font-extrabold print:text-[16px]">
                    {formatPrice(orderData.shippingCost)}
                  </p>
                </div>

                <div className="min-h-[90px] border-r border-gray-300 px-3 py-5 text-center print:min-h-[75px] print:py-4">
                  <h5 className="mb-4 text-[11px] font-extrabold uppercase text-black print:mb-3 print:text-[10px]">
                    Discount
                  </h5>
                  <p className="text-[18px] font-extrabold print:text-[16px]">
                    {formatPrice(totalDiscount)}
                  </p>
                </div>

                <div className="min-h-[90px] bg-white px-3 py-5 text-center text-black print:min-h-[75px] print:py-4">
                  <h5 className="mb-4 text-[11px] font-extrabold uppercase text-black print:mb-3 print:text-[10px]">
                    Total Amount
                  </h5>
                  <p className="text-[26px] font-extrabold print:text-[22px]">
                    {formatPrice(orderData.totalAmount)}
                  </p>
                </div>
              </div>

              {/* Coupon */}
              <div className="min-h-[50px] py-5 text-center text-[12px] font-extrabold leading-relaxed text-green-700 print:min-h-[38px] print:py-4 print:text-[11px]">
                {couponSummary && (
                  <div>
                    Coupon: {couponSummary} ({formatPrice(couponDiscount)})
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-300 border-b-2 border-b-green-700 py-5 text-center text-[12px] leading-relaxed text-gray-900 print:py-4 print:text-[11px]">
                <div>
                  Thank you for your business! We appreciate your trust in
                  Supplefied.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handlePrint = useReactToPrint({
    content: () => printRef?.current,
    documentTitle: "Receipt",
  });

  const handlePrintReceipt = async () => {
    try {
      handlePrint();
    } catch (err) {
      notifyError("Failed to print");
    }
  };

  return (
    <>
      <div>{content}</div>

      <div className="container mx-auto grid px-6 print:hidden">
        <div className="mb-4 mt-3 flex justify-between">
          <button onClick={handlePrintReceipt} className="tp-btn px-5 py-2">
            Print Invoice
            <span className="ml-2">
              <Invoice />
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsArea;
