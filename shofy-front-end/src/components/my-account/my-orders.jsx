import dayjs from "dayjs";
import Link from "next/link";
import React from "react";
import CancelOrder from "../order/cancel-order";

const STATUS_META = {
  pending: {
    label: "Pending",
    color: "#6364DB",
    background: "rgba(99, 100, 219, 0.1)",
  },
  processing: {
    label: "Processing",
    color: "#B7791F",
    background: "rgba(255, 180, 34, 0.16)",
  },
  delivered: {
    label: "Delivered",
    color: "#08AF5C",
    background: "rgba(8, 175, 92, 0.12)",
  },
  cancel: {
    label: "Cancelled",
    color: "#D93D1E",
    background: "rgba(217, 61, 30, 0.12)",
  },
};

const getStatusMeta = (status = "") => {
  const key = String(status || "").toLowerCase();
  return STATUS_META[key] || {
    label: status || "Unknown",
    color: "#55585B",
    background: "rgba(85, 88, 91, 0.12)",
  };
};

const MyOrders = ({ orderData }) => {
  const order_items = orderData?.orders;
  return (
    <div className="profile__ticket table-responsive">
      {!order_items ||
        (order_items?.length === 0 && (
          <div
            style={{ height: "210px" }}
            className="d-flex align-items-center justify-content-center"
          >
            <div className="text-center">
              <i
                style={{ fontSize: "30px" }}
                className="fa-solid fa-cart-circle-xmark"
              ></i>
              <p>You Have no order Yet!</p>
            </div>
          </div>
        ))}
      {order_items && order_items?.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Order Id</th>
              <th scope="col">Order Time</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {order_items.map((item, i) => {
              const status = getStatusMeta(item.status);

              return (
                <tr key={i}>
                  <th scope="row">#{item._id.substring(20, 25)}</th>
                  <td data-info="title">
                    {dayjs(item.createdAt).format("MMMM D, YYYY")}
                  </td>
                  <td data-info={`status ${item.status}`}>
                    <span
                      style={{
                        color: status.color,
                        backgroundColor: status.background,
                        borderRadius: "999px",
                        display: "inline-block",
                        fontWeight: 600,
                        lineHeight: 1,
                        padding: "7px 12px",
                      }}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td>
                    <Link href={`/order/${item._id}`} className="tp-logout-btn">
                      Invoice
                    </Link>
                    <CancelOrder order={item} compact />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrders;
