"use client";

import React, { useState } from "react";
import { useCancelUserOrderMutation } from "@/redux/features/order/orderApi";
import { notifyError, notifySuccess } from "@/utils/toast";

const CANCELLATION_REASONS = [
  { value: "ordered_by_mistake", label: "Ordered by mistake" },
  { value: "change_order", label: "Need to change the order" },
  { value: "delivery_too_long", label: "Delivery will take too long" },
  { value: "payment_issue", label: "Payment issue" },
  { value: "found_another_option", label: "Found another option" },
  { value: "other", label: "Other" },
];

const CancelOrder = ({ order, compact = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reasonCode, setReasonCode] = useState("");
  const [reason, setReason] = useState("");
  const [cancelOrder, { isLoading }] = useCancelUserOrderMutation();

  if (!order || order.status !== "pending") {
    return null;
  }

  const closeDialog = (force = false) => {
    if (isLoading && !force) return;
    setIsOpen(false);
    setReasonCode("");
    setReason("");
  };

  const handleCancelOrder = async (event) => {
    event.preventDefault();

    if (!reasonCode) {
      notifyError("Please select a cancellation reason");
      return;
    }

    if (reasonCode === "other" && reason.trim().length < 5) {
      notifyError("Please briefly explain your cancellation reason");
      return;
    }

    try {
      const result = await cancelOrder({
        id: order._id,
        reasonCode,
        reason: reason.trim(),
      }).unwrap();
      notifySuccess(result.message || "Your order has been cancelled");
      closeDialog(true);
    } catch (error) {
      notifyError(error?.data?.message || "The order could not be cancelled");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={compact ? "tp-logout-btn" : "tp-btn"}
        style={
          compact
            ? { borderColor: "#dc2626", color: "#dc2626", marginLeft: "8px" }
            : { background: "#dc2626", borderColor: "#dc2626" }
        }
      >
        Cancel order
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`cancel-order-title-${order._id}`}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            background: "rgba(15, 23, 42, 0.58)",
          }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <form
            onSubmit={handleCancelOrder}
            style={{
              width: "100%",
              maxWidth: "520px",
              borderRadius: "14px",
              background: "#fff",
              boxShadow: "0 24px 70px rgba(15, 23, 42, 0.25)",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "24px 26px 18px" }}>
              <h3
                id={`cancel-order-title-${order._id}`}
                style={{ marginBottom: "8px", fontSize: "22px" }}
              >
                Cancel order #{order.invoice || order._id.slice(-5)}
              </h3>
              <p style={{ margin: 0, color: "#64748b", lineHeight: 1.6 }}>
                This action stops fulfilment and cannot be undone. Please tell
                us why you are cancelling.
              </p>
            </div>

            <div style={{ padding: "0 26px 24px" }}>
              <label
                htmlFor={`cancel-reason-${order._id}`}
                style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}
              >
                Cancellation reason
              </label>
              <select
                id={`cancel-reason-${order._id}`}
                value={reasonCode}
                onChange={(event) => setReasonCode(event.target.value)}
                disabled={isLoading}
                style={{
                  width: "100%",
                  minHeight: "46px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  padding: "0 12px",
                  background: "#fff",
                }}
              >
                <option value="">Select a reason</option>
                {CANCELLATION_REASONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>

              <label
                htmlFor={`cancel-note-${order._id}`}
                style={{
                  display: "block",
                  marginTop: "18px",
                  marginBottom: "8px",
                  fontWeight: 600,
                }}
              >
                Additional details {reasonCode === "other" ? "(required)" : "(optional)"}
              </label>
              <textarea
                id={`cancel-note-${order._id}`}
                value={reason}
                onChange={(event) => setReason(event.target.value.slice(0, 500))}
                disabled={isLoading}
                rows={4}
                placeholder="Add a short explanation"
                style={{
                  width: "100%",
                  resize: "vertical",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  padding: "12px",
                }}
              />
              <div
                style={{
                  marginTop: "6px",
                  textAlign: "right",
                  color: "#94a3b8",
                  fontSize: "12px",
                }}
              >
                {reason.length}/500
              </div>

              {order.paymentMethod === "Razorpay" && (
                <p
                  style={{
                    margin: "14px 0 0",
                    borderRadius: "8px",
                    background: "#fff7ed",
                    padding: "10px 12px",
                    color: "#9a3412",
                    fontSize: "13px",
                  }}
                >
                  Your paid order will be marked for refund review after
                  cancellation.
                </p>
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                borderTop: "1px solid #e2e8f0",
                padding: "16px 26px",
                background: "#f8fafc",
              }}
            >
              <button
                type="button"
                onClick={closeDialog}
                disabled={isLoading}
                style={{
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  background: "#fff",
                  padding: "10px 16px",
                  fontWeight: 600,
                }}
              >
                Keep order
              </button>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  border: 0,
                  borderRadius: "8px",
                  background: "#dc2626",
                  color: "#fff",
                  padding: "10px 16px",
                  fontWeight: 600,
                  opacity: isLoading ? 0.65 : 1,
                }}
              >
                {isLoading ? "Cancelling..." : "Confirm cancellation"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default CancelOrder;
