import { createSlice } from "@reduxjs/toolkit";
import { notifyError, notifySuccess } from "@/utils/toast";
import {
  getProductList,
  merge_saved_product_lists,
  removeProductListItem,
  toggleProductListItem,
} from "./productListThunks";

const initialState = {
  compareItems: [],
  isLoading: false,
};

const applyCompare = (state, payload) => {
  state.compareItems = payload?.items || [];
};

const isCompareAction = (action) => {
  const arg = action.meta?.arg;
  const type = typeof arg === "string" ? arg : arg?.type;
  return type === "compare" || action.type === merge_saved_product_lists.fulfilled.type;
};

export const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    clearCompareState: (state) => {
      state.compareItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductList.fulfilled, (state, action) => {
        if (action.payload?.type === "compare") {
          applyCompare(state, action.payload.data);
        }
      })
      .addCase(toggleProductListItem.fulfilled, (state, action) => {
        if (action.payload?.type !== "compare") {
          return;
        }

        const product = action.payload.product;
        const wasAdded = !state.compareItems.some((item) => item._id === product._id);
        applyCompare(state, action.payload.data);

        if (wasAdded) {
          notifySuccess(`${product.title} added to compare`);
        } else {
          notifyError(`${product.title} removed from compare`);
        }
      })
      .addCase(removeProductListItem.fulfilled, (state, action) => {
        if (action.payload?.type === "compare") {
          applyCompare(state, action.payload.data);
          notifyError(`${action.payload.product.title} removed from compare`);
        }
      })
      .addCase(merge_saved_product_lists.fulfilled, (state, action) => {
        applyCompare(state, action.payload?.compare);
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("productList/") &&
          action.type.endsWith("/pending") &&
          isCompareAction(action),
        (state) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("productList/") &&
          action.type.endsWith("/fulfilled") &&
          isCompareAction(action),
        (state) => {
          state.isLoading = false;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("productList/") &&
          action.type.endsWith("/rejected") &&
          isCompareAction(action),
        (state, action) => {
          state.isLoading = false;
          notifyError(action.error?.message || "Compare update failed");
        }
      );
  },
});

export const add_to_compare = (product) =>
  toggleProductListItem({ type: "compare", product });
export const remove_compare_product = (product) =>
  removeProductListItem({ type: "compare", product });
export const get_compare_products = () => getProductList("compare");
export const { clearCompareState } = compareSlice.actions;
export default compareSlice.reducer;
