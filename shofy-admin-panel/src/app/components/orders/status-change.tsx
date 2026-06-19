import React from "react";
import ReactSelect from "react-select";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useUpdateStatusMutation } from "@/redux/order/orderApi";

// option
const options = [
  { value: "delivered", label: "delivered" },
  { value: "processing", label: "Processing" },
  { value: "pending", label: "Pending" },
  { value: "cancel", label: "cancel" },
];

const OrderStatusChange = ({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus?: string;
}) => {
  const [updateStatus, { isLoading }] = useUpdateStatusMutation();
  const handleChange = async (value: string | undefined, id: string) => {
    if (value) {
      try {
        const res = await updateStatus({
          id,
          status: { status: value },
        }).unwrap();
        notifySuccess(res.message);
      } catch (error: any) {
        notifyError(error?.data?.message || "Order status could not be updated");
      }
    }
  };
  return (
    <ReactSelect
      className="w-full text-xs"
      onChange={(value) => handleChange(value?.value, id)}
      options={options}
      isDisabled={
        isLoading || currentStatus === "cancel" || currentStatus === "delivered"
      }
      placeholder={
        currentStatus === "cancel"
          ? "Cancelled"
          : currentStatus === "delivered"
          ? "Delivered"
          : "Update"
      }
    />
  );
};

export default OrderStatusChange;
