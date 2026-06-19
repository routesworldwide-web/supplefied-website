import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const GUEST_CART_KEY = "guestCartId";

const getApiBaseUrl = () => process.env.NEXT_PUBLIC_API_BASE_URL || "";

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

const requestProductList = async (path = "", options = {}) => {
  const response = await fetch(`${getApiBaseUrl()}/api/product-list${path}`, {
    ...options,
    headers: {
      ...buildHeaders(options.listHeaders),
      ...(options.headers || {}),
    },
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || result?.error || "Product list request failed");
  }

  return result.data;
};

export const getProductList = createAsyncThunk(
  "productList/get",
  async (type) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(`${type}_items`);
    }

    return {
      type,
      data: await requestProductList(`/${type}`, {
        method: "GET",
        listHeaders: { includeGuest: true },
      }),
    };
  }
);

export const toggleProductListItem = createAsyncThunk(
  "productList/toggle",
  async ({ type, product }) => {
    const productId = product?._id || product?.productId;

    if (!productId) {
      throw new Error("Product id is required");
    }

    return {
      type,
      product,
      data: await requestProductList(`/${type}/items`, {
        method: "POST",
        body: JSON.stringify({ productId }),
        listHeaders: { includeGuest: true },
      }),
    };
  }
);

export const removeProductListItem = createAsyncThunk(
  "productList/remove",
  async ({ type, product }) => {
    const productId = product?._id || product?.productId || product?.id;

    if (!productId) {
      throw new Error("Product id is required");
    }

    return {
      type,
      product,
      data: await requestProductList(`/${type}/items/${productId}`, {
        method: "DELETE",
        listHeaders: { includeGuest: true },
      }),
    };
  }
);

export const merge_saved_product_lists = createAsyncThunk(
  "productList/merge",
  async () => {
    const guestCartId = getGuestCartId(false);
    const data = await requestProductList("/merge", {
      method: "POST",
      body: JSON.stringify({ guestCartId }),
      headers: guestCartId ? { "x-guest-cart-id": guestCartId } : {},
      listHeaders: { includeGuest: false },
    });

    if (typeof window !== "undefined") {
      localStorage.removeItem("wishlist_items");
      localStorage.removeItem("compare_items");
    }

    return data;
  }
);
