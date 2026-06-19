import React from "react";
import dayjs from "dayjs";
import { IOrder } from "@/types/order-amount-type";
import OrderActions from "../orders/order-actions";
import OrderStatusChange from "../orders/status-change";

const TableItem = (props: { order: IOrder }) => {
  const { order } = props;
  const p_method =
    order.paymentMethod === "COD"
      ? "Cash"
      : order.paymentMethod === "Card"
      ? "Card"
      : order.paymentMethod;
  return (
    <tr className="bg-white border-b border-gray6 last:border-0 text-start">
      <td className="px-3 py-4 font-medium text-heading">#{order.invoice}</td>
      <td className="px-3 py-4">
        {dayjs(order.createdAt).format("MMM D, YYYY h:mm A")}
      </td>
      <td className="px-3 py-4">{order.name}</td>
      <td className="px-3 py-4">{p_method}</td>
      <td className="px-3 py-4 font-medium text-heading">
        {new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(order.totalAmount)}
      </td>
      <td className="px-3 py-3">
        <span
          className={`text-[11px] px-3 py-1 rounded-md leading-none ${
            order.status === "pending"
              ? "text-warning bg-warning/10"
              : order.status === "delivered"
              ? "text-success bg-success/10"
              : order.status === "processing"
              ? "text-indigo-500 bg-indigo-100"
              : order.status === "cancel"
              ? "text-danger bg-danger/10"
              : ""
          }  font-medium`}
        >
          {order.status === "cancel" ? "Cancelled" : order.status}
        </span>
      </td>
      <td className="px-3 py-3">
        <OrderStatusChange id={order._id} currentStatus={order.status} />
      </td>
      {/* order actions */}
      <OrderActions id={order._id} cls="px-3 text-xs py-3" />
      {/* order actions */}
    </tr>
  );
};

export default TableItem;
