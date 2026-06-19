const mongoose = require("mongoose");
const ProductList = require("../model/ProductList");
const Product = require("../model/Products");

const VALID_TYPES = ["wishlist", "compare"];

const validateType = (type) => {
  if (!VALID_TYPES.includes(type)) {
    const error = new Error("Invalid product list type");
    error.statusCode = 400;
    throw error;
  }
};

const getOwnerQuery = ({ type, userId, guestCartId }) => {
  validateType(type);

  if (userId) {
    return { type, user: userId, disabled: false };
  }

  if (guestCartId) {
    return { type, guestCartId, disabled: false };
  }

  return null;
};

const getOrCreateList = async ({ type, userId, guestCartId }) => {
  const ownerQuery = getOwnerQuery({ type, userId, guestCartId });

  if (!ownerQuery) {
    return null;
  }

  const createPayload = userId
    ? { type, user: userId, items: [] }
    : { type, guestCartId, items: [] };

  return ProductList.findOneAndUpdate(
    ownerQuery,
    { $setOnInsert: createPayload },
    { new: true, upsert: true }
  );
};

const getList = async ({ type, userId, guestCartId }) => {
  const ownerQuery = getOwnerQuery({ type, userId, guestCartId });

  if (!ownerQuery) {
    return null;
  }

  return ProductList.findOne(ownerQuery);
};

const formatList = async (list) => {
  if (!list) {
    return { items: [] };
  }

  await list.populate("items");

  const items = list.items.filter(Boolean);
  const normalizedIds = items.map((product) => product._id);

  if (normalizedIds.length !== list.items.length) {
    list.items = normalizedIds;
    await list.save();
  }

  return { items };
};

const addProduct = async ({ type, userId, guestCartId, productId }) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    const error = new Error("Invalid productId");
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findById(productId);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const list = await getOrCreateList({ type, userId, guestCartId });

  if (!list) {
    const error = new Error("List owner is required");
    error.statusCode = 400;
    throw error;
  }

  const exists = list.items.some((item) => item.toString() === productId);

  if (exists) {
    list.items = list.items.filter((item) => item.toString() !== productId);
  } else {
    list.items.push(productId);
  }

  await list.save();
  return formatList(list);
};

const removeProduct = async ({ type, userId, guestCartId, productId }) => {
  const list = await getList({ type, userId, guestCartId });

  if (!list) {
    return formatList(null);
  }

  list.items = list.items.filter((item) => item.toString() !== productId);
  await list.save();
  return formatList(list);
};

const clearList = async ({ type, userId, guestCartId }) => {
  const list = await getList({ type, userId, guestCartId });

  if (!list) {
    return formatList(null);
  }

  list.items = [];
  await list.save();
  return formatList(list);
};

const mergeGuestList = async ({ type, userId, guestCartId }) => {
  if (!userId || !guestCartId) {
    return formatList(await getList({ type, userId }));
  }

  const guestList = await getList({ type, guestCartId });
  const userList = await getOrCreateList({ type, userId });

  if (!guestList || guestList.items.length === 0) {
    return formatList(userList);
  }

  for (const item of guestList.items) {
    const productId = item.toString();
    const exists = userList.items.some((userItem) => userItem.toString() === productId);

    if (!exists) {
      userList.items.push(item);
    }
  }

  guestList.disabled = true;
  guestList.items = [];
  await guestList.save();
  await userList.save();

  return formatList(userList);
};

const mergeGuestLists = async ({ userId, guestCartId }) => {
  const result = {};

  for (const type of VALID_TYPES) {
    result[type] = await mergeGuestList({ type, userId, guestCartId });
  }

  return result;
};

module.exports = {
  addProduct,
  clearList,
  formatList,
  getList,
  mergeGuestLists,
  removeProduct,
};
