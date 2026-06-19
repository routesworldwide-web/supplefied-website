const jwt = require("jsonwebtoken");
const productListService = require("../services/product-list.service");
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

const sendList = (res, list) => {
  res.status(200).json({
    success: true,
    data: list,
  });
};

exports.getList = async (req, res, next) => {
  try {
    const owner = getRequestOwner(req);
    const list = await productListService.getList({
      ...owner,
      type: req.params.type,
    });
    sendList(res, await productListService.formatList(list));
  } catch (error) {
    next(error);
  }
};

exports.addProduct = async (req, res, next) => {
  try {
    const owner = getRequestOwner(req);
    const list = await productListService.addProduct({
      ...owner,
      type: req.params.type,
      productId: req.body.productId,
    });
    sendList(res, list);
  } catch (error) {
    next(error);
  }
};

exports.removeProduct = async (req, res, next) => {
  try {
    const owner = getRequestOwner(req);
    const list = await productListService.removeProduct({
      ...owner,
      type: req.params.type,
      productId: req.params.productId,
    });
    sendList(res, list);
  } catch (error) {
    next(error);
  }
};

exports.clearList = async (req, res, next) => {
  try {
    const owner = getRequestOwner(req);
    const list = await productListService.clearList({
      ...owner,
      type: req.params.type,
    });
    sendList(res, list);
  } catch (error) {
    next(error);
  }
};

exports.mergeGuestLists = async (req, res, next) => {
  try {
    const owner = getRequestOwner(req);

    if (!owner.userId) {
      return res.status(401).json({
        success: false,
        message: "Login is required to merge product lists",
      });
    }

    const lists = await productListService.mergeGuestLists(owner);
    sendList(res, lists);
  } catch (error) {
    next(error);
  }
};
