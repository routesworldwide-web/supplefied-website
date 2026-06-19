const mongoose = require("mongoose");
const Cart = require("../model/Cart");
const Product = require("../model/Products");

const getOwnerQuery = ({ userId, guestCartId }) => {
  if (userId) {
    return { user: userId, disabled: false };
  }

  if (guestCartId) {
    return { guestCartId, disabled: false };
  }

  return null;
};

const getOrCreateCart = async ({ userId, guestCartId }) => {
  const ownerQuery = getOwnerQuery({ userId, guestCartId });

  if (!ownerQuery) {
    return null;
  }

  const createPayload = userId
    ? { user: userId, items: [] }
    : { guestCartId, items: [] };

  return Cart.findOneAndUpdate(
    ownerQuery,
    { $setOnInsert: createPayload },
    { new: true, upsert: true }
  );
};

const getCart = async ({ userId, guestCartId }) => {
  const ownerQuery = getOwnerQuery({ userId, guestCartId });

  if (!ownerQuery) {
    return null;
  }

  return Cart.findOne(ownerQuery);
};

const normalizeQuantity = (value) => {
  const quantity = Number(value);
  return Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;
};

const calculateDiscountedPrice = (product) => {
  const price = Number(product.price || 0);
  const discount = Number(product.discount || 0);
  return discount > 0 ? price - (price * discount) / 100 : price;
};

const formatCart = async (cart) => {
  if (!cart) {
    return {
      items: [],
      totalAmount: 0,
      totalQuantity: 0,
    };
  }

  await cart.populate("items.product");

  const items = [];
  const normalizedItems = [];

  for (const item of cart.items) {
    const product = item.product;

    if (!product) {
      continue;
    }

    const stock = Number(product.quantity || 0);
    const status = stock <= 0 ? "out-of-stock" : product.status;
    const orderQuantity = Math.min(normalizeQuantity(item.quantity), Math.max(stock, 0));

    if (orderQuantity < 1) {
      continue;
    }

    normalizedItems.push({
      product: product._id,
      quantity: orderQuantity,
    });

    items.push({
      _id: product._id,
      productId: product._id,
      sku: product.sku,
      slug: product.slug,
      title: product.title,
      img: product.img,
      price: product.price,
      discount: product.discount || 0,
      quantity: stock,
      orderQuantity,
      status,
      category: product.category,
      tags: product.tags,
      productType: product.productType,
    });
  }

  if (normalizedItems.length !== cart.items.length) {
    cart.items = normalizedItems;
    await cart.save();
  }

  const totalAmount = items.reduce(
    (total, item) => total + calculateDiscountedPrice(item) * item.orderQuantity,
    0
  );
  const totalQuantity = items.reduce((total, item) => total + item.orderQuantity, 0);

  return {
    items,
    totalAmount: Number(totalAmount.toFixed(2)),
    totalQuantity,
  };
};

const addItem = async ({ userId, guestCartId, productId, quantity }) => {
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

  if (product.status === "out-of-stock" || Number(product.quantity || 0) <= 0) {
    const error = new Error("Product is out of stock");
    error.statusCode = 400;
    throw error;
  }

  const cart = await getOrCreateCart({ userId, guestCartId });

  if (!cart) {
    const error = new Error("Cart owner is required");
    error.statusCode = 400;
    throw error;
  }

  const requestedQuantity = normalizeQuantity(quantity);
  const existingItem = cart.items.find((item) => item.product.toString() === productId);
  const currentQuantity = existingItem ? existingItem.quantity : 0;
  const nextQuantity = Math.min(currentQuantity + requestedQuantity, product.quantity);

  if (existingItem) {
    existingItem.quantity = nextQuantity;
  } else {
    cart.items.push({ product: productId, quantity: nextQuantity });
  }

  await cart.save();
  return formatCart(cart);
};

const updateItem = async ({ userId, guestCartId, productId, quantity }) => {
  const cart = await getCart({ userId, guestCartId });

  if (!cart) {
    return formatCart(null);
  }

  const item = cart.items.find((cartItem) => cartItem.product.toString() === productId);

  if (!item) {
    return formatCart(cart);
  }

  const product = await Product.findById(productId);

  if (!product || Number(product.quantity || 0) <= 0 || product.status === "out-of-stock") {
    cart.items = cart.items.filter((cartItem) => cartItem.product.toString() !== productId);
  } else {
    item.quantity = Math.min(normalizeQuantity(quantity), product.quantity);
  }

  await cart.save();
  return formatCart(cart);
};

const removeItem = async ({ userId, guestCartId, productId }) => {
  const cart = await getCart({ userId, guestCartId });

  if (!cart) {
    return formatCart(null);
  }

  cart.items = cart.items.filter((item) => item.product.toString() !== productId);
  await cart.save();
  return formatCart(cart);
};

const clearCart = async ({ userId, guestCartId }) => {
  const cart = await getCart({ userId, guestCartId });

  if (!cart) {
    return formatCart(null);
  }

  cart.items = [];
  await cart.save();
  return formatCart(cart);
};

const mergeGuestCart = async ({ userId, guestCartId }) => {
  if (!userId || !guestCartId) {
    return formatCart(await getCart({ userId }));
  }

  const guestCart = await getCart({ guestCartId });
  const userCart = await getOrCreateCart({ userId });

  if (!guestCart || guestCart.items.length === 0) {
    return formatCart(userCart);
  }

  for (const guestItem of guestCart.items) {
    const product = await Product.findById(guestItem.product);

    if (!product || product.status === "out-of-stock" || Number(product.quantity || 0) <= 0) {
      continue;
    }

    const existingItem = userCart.items.find(
      (item) => item.product.toString() === guestItem.product.toString()
    );
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const nextQuantity = Math.min(currentQuantity + guestItem.quantity, product.quantity);

    if (existingItem) {
      existingItem.quantity = nextQuantity;
    } else {
      userCart.items.push({
        product: guestItem.product,
        quantity: Math.min(guestItem.quantity, product.quantity),
      });
    }
  }

  guestCart.disabled = true;
  guestCart.items = [];
  await guestCart.save();
  await userCart.save();

  return formatCart(userCart);
};

module.exports = {
  addItem,
  updateItem,
  removeItem,
  clearCart,
  formatCart,
  getCart,
  mergeGuestCart,
};
