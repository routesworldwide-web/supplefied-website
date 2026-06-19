const PRODUCT_TYPE_LABELS = {
  electronics: "Supplefied",
};

export const getProductTypeLabel = (type) => {
  if (!type) return "";
  return PRODUCT_TYPE_LABELS[String(type).toLowerCase()] || type;
};
