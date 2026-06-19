import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";

const ResetButton = ({setPriceValues,maxPrice}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleReset = () => {
    if (setPriceValues) {
      setPriceValues([0, maxPrice]);
    }
    router.push("/shop");
    dispatch(handleFilterSidebarClose());
  };
  return (
    <div className="tp-shop-widget mb-50">
      <h3 className="tp-shop-widget-title">Reset Filter</h3>
      <button
        onClick={handleReset}
        className="tp-btn text-light bg-dark"
      >
        Reset Filter
      </button>
    </div>
  );
};

export default ResetButton;
