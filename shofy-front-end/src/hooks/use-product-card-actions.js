'use client';

import { useDispatch, useSelector } from "react-redux";
import { add_cart_product } from "@/redux/features/cartSlice";
import { add_to_wishlist } from "@/redux/features/wishlist-slice";
import { add_to_compare } from "@/redux/features/compareSlice";

const getProductId = (item) => {
  const product = item?.product || item?.productId || item;
  const id = product?._id || product?.id || product;

  return id ? String(id) : "";
};

const containsProduct = (items, product) => {
  const productId = getProductId(product);
  return Boolean(productId) && items.some((item) => getProductId(item) === productId);
};

const useProductCardActions = (product) => {
  const dispatch = useDispatch();
  const cartProducts = useSelector((state) => state.cart.cart_products);
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const compareItems = useSelector((state) => state.compare.compareItems);

  const isInCart = containsProduct(cartProducts, product);
  const isInWishlist = containsProduct(wishlist, product);
  const isInCompare = containsProduct(compareItems, product);

  return {
    isInCart,
    isInWishlist,
    isInCompare,
    cartLabel: isInCart ? "Add One More to Cart" : "Add to Cart",
    wishlistLabel: isInWishlist ? "Remove From Wishlist" : "Add To Wishlist",
    compareLabel: isInCompare ? "Remove From Compare" : "Add To Compare",
    addToCart: () => dispatch(add_cart_product({ product, quantity: 1 })),
    toggleWishlist: () => dispatch(add_to_wishlist(product)),
    toggleCompare: () => dispatch(add_to_compare(product)),
  };
};

export default useProductCardActions;
