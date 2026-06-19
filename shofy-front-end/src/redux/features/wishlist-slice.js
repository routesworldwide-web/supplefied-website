import { createSlice } from "@reduxjs/toolkit";
import { notifyError, notifySuccess } from "@/utils/toast";
import {
  getProductList,
  merge_saved_product_lists,
  removeProductListItem,
  toggleProductListItem,
} from "./productListThunks";

const initialState = {
  wishlist: [],
  isLoading: false,
};

const applyWishlist = (state, payload) => {
  state.wishlist = payload?.items || [];
};

const isWishlistAction = (action) => {
  const arg = action.meta?.arg;
  const type = typeof arg === "string" ? arg : arg?.type;
  return type === "wishlist" || action.type === merge_saved_product_lists.fulfilled.type;
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlistState: (state) => {
      state.wishlist = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductList.fulfilled, (state, action) => {
        if (action.payload?.type === "wishlist") {
          applyWishlist(state, action.payload.data);
        }
      })
      .addCase(toggleProductListItem.fulfilled, (state, action) => {
        if (action.payload?.type !== "wishlist") {
          return;
        }

        const product = action.payload.product;
        const wasAdded = !state.wishlist.some((item) => item._id === product._id);
        applyWishlist(state, action.payload.data);

        if (wasAdded) {
          notifySuccess(`${product.title} added to wishlist`);
        } else {
          notifyError(`${product.title} removed from wishlist`);
        }
      })
      .addCase(removeProductListItem.fulfilled, (state, action) => {
        if (action.payload?.type === "wishlist") {
          applyWishlist(state, action.payload.data);
          notifyError(`${action.payload.product.title} removed from wishlist`);
        }
      })
      .addCase(merge_saved_product_lists.fulfilled, (state, action) => {
        applyWishlist(state, action.payload?.wishlist);
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("productList/") &&
          action.type.endsWith("/pending") &&
          isWishlistAction(action),
        (state) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("productList/") &&
          action.type.endsWith("/fulfilled") &&
          isWishlistAction(action),
        (state) => {
          state.isLoading = false;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("productList/") &&
          action.type.endsWith("/rejected") &&
          isWishlistAction(action),
        (state, action) => {
          state.isLoading = false;
          notifyError(action.error?.message || "Wishlist update failed");
        }
      );
  },
});

export const add_to_wishlist = (product) =>
  toggleProductListItem({ type: "wishlist", product });
export const remove_wishlist_product = (product) =>
  removeProductListItem({ type: "wishlist", product });
export const get_wishlist_products = () => getProductList("wishlist");
export const { clearWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;
