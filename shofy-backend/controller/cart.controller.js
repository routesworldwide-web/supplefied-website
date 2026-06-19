const jwt = require("jsonwebtoken");
const cartService = require("../services/cart.service");
const { secret } = require("../config/secret");

const getRequestOwner = (req) => {
  const guestCartId = req.headers["x-guest-cart-id"] || req.body?.guestCartId;
  const token = req.headers?.authorization?.split(" ")?.[1];

  if (!token) {
    return { guestCartId };
  }

  try {
    const decoded = jwt.verify(token, secret.token_secret);
    return {
      userId: decoded._id,
      guestCartId,
    };
  } catch {
    return { guestCartId };
  }
};

const sendCart = (res, cart) => {
  res.status(200).json({
    success: true,
    data: cart,
  });
};

exports.getCart = async (req, res, next) => {
  try {
    const owner = getRequestOwner(req);
    const cart = await cartService.getCart(owner);
    sendCart(res, await cartService.formatCart(cart));
  } catch (error) {
    next(error);
  }
};

exports.addItem = async (req, res, next) => {
  try {
    const owner = getRequestOwner(req);
    const cart = await cartService.addItem({
      ...owner,
      productId: req.body.productId,
      quantity: req.body.quantity,
    });
    sendCart(res, cart);
  } catch (error) {
    next(error);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const owner = getRequestOwner(req);
    const cart = await cartService.updateItem({
      ...owner,
      productId: req.params.productId,
      quantity: req.body.quantity,
    });
    sendCart(res, cart);
  } catch (error) {
    next(error);
  }
};

exports.removeItem = async (req, res, next) => {
  try {
    const owner = getRequestOwner(req);
    const cart = await cartService.removeItem({
      ...owner,
      productId: req.params.productId,
    });
    sendCart(res, cart);
  } catch (error) {
    next(error);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const owner = getRequestOwner(req);
    const cart = await cartService.clearCart(owner);
    sendCart(res, cart);
  } catch (error) {
    next(error);
  }
};

exports.mergeGuestCart = async (req, res, next) => {
  try {
    const owner = getRequestOwner(req);

    if (!owner.userId) {
      return res.status(401).json({
        success: false,
        message: "Login is required to merge cart",
      });
    }

    const cart = await cartService.mergeGuestCart(owner);
    sendCart(res, cart);
  } catch (error) {
    next(error);
  }
};
