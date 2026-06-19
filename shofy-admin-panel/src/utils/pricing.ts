type PricedItem = {
  price?: number;
  discount?: number;
  orderQuantity?: number;
  quantity?: number;
};

type CartTotals = {
  quantity: number;
  productDiscount: number;
  discountedSubtotal: number;
  originalSubtotal: number;
};

const toNumber = (value: unknown) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

export const roundPrice = (value: unknown) => Number(toNumber(value).toFixed(2));

export const formatPrice = (value: unknown) => `₹${roundPrice(value).toFixed(2)}`;

export const formatDiscountPercent = (value: unknown) => {
  const discount = toNumber(value);
  return `${Number.isInteger(discount) ? discount : discount.toFixed(2)}%`;
};

export const getOrderQuantity = (item: Pick<PricedItem, "orderQuantity" | "quantity"> = {}) =>
  toNumber(item.orderQuantity || item.quantity);

export const getProductPricing = (product: Pick<PricedItem, "price" | "discount"> = {}) => {
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

export const getLinePricing = (item: PricedItem = {}) => {
  const pricing = getProductPricing(item);
  const quantity = getOrderQuantity(item);

  return {
    ...pricing,
    quantity,
    lineDiscount: roundPrice(pricing.unitDiscount * quantity),
    lineTotal: roundPrice(pricing.discountedPrice * quantity),
  };
};

export const getCartTotals = (cart: PricedItem[] = []): CartTotals =>
  cart.reduce<CartTotals>(
    (totals, item) => {
      const pricing = getLinePricing(item);
      totals.quantity += pricing.quantity;
      totals.productDiscount += pricing.lineDiscount;
      totals.discountedSubtotal += pricing.lineTotal;
      totals.originalSubtotal += roundPrice(pricing.originalPrice * pricing.quantity);
      return totals;
    },
    {
      quantity: 0,
      productDiscount: 0,
      discountedSubtotal: 0,
      originalSubtotal: 0,
    }
  );
