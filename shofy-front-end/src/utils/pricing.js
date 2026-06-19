const roundPrice = (value) => Number(Number(value || 0).toFixed(2));

const toNumber = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

export const formatPrice = (value) => `\u20B9${roundPrice(value).toFixed(2)}`;

export const formatDiscountPercent = (value) => {
  const discount = toNumber(value);
  return `${Number.isInteger(discount) ? discount : discount.toFixed(2)}%`;
};

export const getProductPricing = (product = {}) => {
  const originalPrice = roundPrice(product.price);
  const discountPercent = Math.max(toNumber(product.discount), 0);
  const unitDiscount = roundPrice((originalPrice * discountPercent) / 100);
  const discountedPrice = roundPrice(originalPrice - unitDiscount);
  const hasDiscount = discountPercent > 0 && discountedPrice < originalPrice;

  return {
    originalPrice,
    discountedPrice: hasDiscount ? discountedPrice : originalPrice,
    discountPercent,
    unitDiscount: hasDiscount ? unitDiscount : 0,
    hasDiscount,
  };
};

export const getProductUnitPrice = (product = {}) => (
  getProductPricing(product).discountedPrice
);

export const getLineTotal = (product = {}) => {
  const quantity = toNumber(product.orderQuantity || product.quantity);
  return roundPrice(getProductUnitPrice(product) * quantity);
};

export const getLineDiscount = (product = {}) => {
  const quantity = toNumber(product.orderQuantity || product.quantity);
  return roundPrice(getProductPricing(product).unitDiscount * quantity);
};
