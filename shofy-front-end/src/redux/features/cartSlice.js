import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { notifyError, notifySuccess } from "@/utils/toast";
import { API_BASE_URL } from "@/config/api";

const GUEST_CART_KEY = "guestCartId";

const getApiBaseUrl = () => API_BASE_URL;

const createGuestCartId = () => {
  if (typeof window === "undefined") {
    return "";
  }

  const cryptoObj = window.crypto || window.msCrypto;

  if (cryptoObj?.randomUUID) {
    return cryptoObj.randomUUID();
  }

  return `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const getGuestCartId = (createIfMissing = true) => {
  if (typeof window === "undefined") {
    return "";
  }

  let guestCartId = localStorage.getItem(GUEST_CART_KEY);

  if (!guestCartId && createIfMissing) {
    guestCartId = createGuestCartId();
    localStorage.setItem(GUEST_CART_KEY, guestCartId);
  }

  return guestCartId;
};

const clearGuestCartId = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(GUEST_CART_KEY);
  }
};

const getAccessToken = () => {
  try {
    const userInfo = Cookies.get("userInfo");
    return userInfo ? JSON.parse(userInfo)?.accessToken : undefined;
  } catch {
    return undefined;
  }
};

const buildHeaders = ({ includeGuest = true } = {}) => {
  const headers = {
    "Content-Type": "application/json",
  };
  const token = getAccessToken();
  const guestCartId = getGuestCartId(includeGuest && !token);

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (guestCartId) {
    headers["x-guest-cart-id"] = guestCartId;
  }

  return headers;
};

const requestCart = async (path = "", options = {}) => {
  const response = await fetch(`${getApiBaseUrl()}/api/cart${path}`, {
    ...options,
    headers: {
      ...buildHeaders(options.cartHeaders),
      ...(options.headers || {}),
    },
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || result?.error || "Cart request failed");
  }

  return result.data;
};

export const get_cart_products = createAsyncThunk("cart/get", async () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("cart_products");
  }

  return requestCart("/", {
    method: "GET",
    cartHeaders: { includeGuest: true },
  });
});

export const add_cart_product = createAsyncThunk(
  "cart/add",
  async (payload, { getState }) => {
    const product = payload?.product || payload;
    const quantity = payload?.quantity || getState().cart.orderQuantity || 1;
    const productId = product?.productId || product?._id;

    if (!productId) {
      throw new Error("Product id is required");
    }

    return requestCart("/items", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
      cartHeaders: { includeGuest: true },
    });
  }
);

export const update_cart_product = createAsyncThunk(
  "cart/update",
  async ({ productId, quantity }) => {
    return requestCart(`/items/${productId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
      cartHeaders: { includeGuest: true },
    });
  }
);

export const quantityDecrement = createAsyncThunk(
  "cart/decrement",
  async (product) => {
    const productId = product?.productId || product?._id;
    const nextQuantity = Math.max(Number(product?.orderQuantity || 1) - 1, 1);

    return requestCart(`/items/${productId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity: nextQuantity }),
      cartHeaders: { includeGuest: true },
    });
  }
);

export const remove_product = createAsyncThunk("cart/remove", async (product) => {
  const productId = product?.productId || product?._id || product?.id;

  return requestCart(`/items/${productId}`, {
    method: "DELETE",
    cartHeaders: { includeGuest: true },
  });
});

export const clearCart = createAsyncThunk("cart/clear", async () => {
  return requestCart("/", {
    method: "DELETE",
    cartHeaders: { includeGuest: true },
  });
});

export const merge_guest_cart = createAsyncThunk("cart/merge", async () => {
  const guestCartId = getGuestCartId(false);
  const cart = await requestCart("/merge", {
    method: "POST",
    body: JSON.stringify({ guestCartId }),
    headers: guestCartId ? { "x-guest-cart-id": guestCartId } : {},
    cartHeaders: { includeGuest: false },
  });
  clearGuestCartId();
  localStorage.removeItem("cart_products");
  return cart;
});

const initialState = {
  cart_products: [],
  orderQuantity: 1,
  cartMiniOpen: false,
  totalAmount: 0,
  totalQuantity: 0,
  isLoading: false,
};

const applyCart = (state, payload) => {
  state.cart_products = payload?.items || [];
  state.totalAmount = payload?.totalAmount || 0;
  state.totalQuantity = payload?.totalQuantity || 0;
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    increment: (state) => {
      state.orderQuantity = state.orderQuantity + 1;
    },
    decrement: (state) => {
      state.orderQuantity = state.orderQuantity > 1 ? state.orderQuantity - 1 : 1;
    },
    initialOrderQuantity: (state) => {
      state.orderQuantity = 1;
    },
    clearCartState: (state) => {
      state.cart_products = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
      state.orderQuantity = 1;
    },
    openCartMini: (state) => {
      state.cartMiniOpen = true;
    },
    closeCartMini: (state) => {
      state.cartMiniOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(add_cart_product.fulfilled, (state, action) => {
        applyCart(state, action.payload);
        state.orderQuantity = 1;
        notifySuccess("Product added to cart");
      })
      .addCase(remove_product.fulfilled, (state, action) => {
        applyCart(state, action.payload);
        notifyError("Product removed from cart");
      })
      .addMatcher(
        (action) => action.type.startsWith("cart/") && action.type.endsWith("/pending"),
        (state) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("cart/") && action.type.endsWith("/fulfilled"),
        (state, action) => {
          state.isLoading = false;
          applyCart(state, action.payload);
          state.orderQuantity = 1;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("cart/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.isLoading = false;
          notifyError(action.error?.message || "Cart update failed");
        }
      );
  },
});

export const {
  increment,
  decrement,
  initialOrderQuantity,
  clearCartState,
  closeCartMini,
  openCartMini,
} = cartSlice.actions;

export default cartSlice.reducer;
