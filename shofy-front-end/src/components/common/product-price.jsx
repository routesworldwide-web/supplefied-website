import React from "react";
import {
  formatDiscountPercent,
  formatPrice,
  getProductPricing,
} from "@/utils/pricing";

const ProductPrice = ({
  product,
  priceClassName = "tp-product-price",
  oldPriceClassName,
  discountClassName,
  showDiscount = true,
}) => {
  const pricing = getProductPricing(product);
  const oldClassName = oldPriceClassName || priceClassName;

  return (
    <>
      <span className={`${priceClassName} new-price`}>
        {formatPrice(pricing.discountedPrice)}
      </span>
      {pricing.hasDiscount && (
        <>
          <span className={`${oldClassName} old-price `}>
            {" "}{formatPrice(pricing.originalPrice)}
          </span>
          {showDiscount && (
            <span className={discountClassName || `${priceClassName}-discount`}>
              {" "}{formatDiscountPercent(pricing.discountPercent)} off
            </span>
          )}
        </>
      )}
    </>
  );
};

export default ProductPrice;
