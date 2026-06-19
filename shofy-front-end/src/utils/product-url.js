export const getProductDetailsUrl = (product) => {
  const productKey = product?.slug || product?._id;
  return productKey ? `/product-details/${productKey}` : "/product-details";
};
