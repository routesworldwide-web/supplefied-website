const Brand = require("../model/Brand");
const Category = require("../model/Category");
const Product = require("../model/Products");
const mongoose = require("mongoose");

const visibleReviewsPopulate = {
  path: "reviews",
  match: { status: { $ne: "Hide" } },
};

// create product service
exports.createProductService = async (data) => {
  const product = await Product.create(data);
  const { _id: productId, brand, category } = product;
  //update Brand
  await Brand.updateOne(
    { _id: brand.id },
    { $addToSet: { products: productId } }
  );
  //Category Brand
  await Category.updateOne(
    { _id: category.id },
    { $addToSet: { products: productId } }
  );
  return product;
};

// create all product service
exports.addAllProductService = async (data) => {
  await Product.deleteMany();
  const products = await Product.insertMany(data);
  for (const product of products) {
    await Brand.findByIdAndUpdate(product.brand.id, {
      $push: { products: product._id },
    });
    await Category.findByIdAndUpdate(product.category.id, {
      $push: { products: product._id },
    });
  }
  return products;
};

// get product data
exports.getAllProductsService = async () => {
  const products = await Product.find({}).populate(visibleReviewsPopulate);
  return products;
};

// get type of product service
exports.getProductTypeService = async (req) => {
  const type = req.params.type;
  const query = req.query;
  let products;
  if (query.new === "true") {
    products = await Product.find({ productType: type })
      .sort({ createdAt: -1 })
      .limit(8)
      .populate(visibleReviewsPopulate);
  } else if (query.featured === "true") {
    products = await Product.find({
      productType: type,
      featured: true,
    }).populate(visibleReviewsPopulate);
  } else if (query.topSellers === "true") {
    products = await Product.find({
      productType: type,
      sellCount: { $gt: 0 },
    })
      .sort({ sellCount: -1 })
      .limit(8)
      .populate(visibleReviewsPopulate);
  } else {
    products = await Product.find({ productType: type }).populate(visibleReviewsPopulate);
  }
  return products;
};

// get offer product service
exports.getOfferTimerProductService = async (query) => {
  const products = await Product.find({
    productType: query,
    "offerDate.endDate": { $gt: new Date() },
  }).populate(visibleReviewsPopulate);
  return products;
};

// get popular product service by type
exports.getPopularProductServiceByType = async (type) => {
  const products = await Product.find({ productType: type })
    .sort({ "reviews.length": -1 })
    .limit(8)
    .populate(visibleReviewsPopulate);
  return products;
};

exports.getTopRatedProductService = async () => {
  const products = await Product.find({
    reviews: { $exists: true, $ne: [] },
  }).populate(visibleReviewsPopulate);

  const topRatedProducts = products.filter((product) => product.reviews.length > 0).map((product) => {
    const totalRating = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating = totalRating / product.reviews.length;

    return {
      ...product.toObject(),
      rating: averageRating,
    };
  });

  topRatedProducts.sort((a, b) => b.rating - a.rating);

  return topRatedProducts;
};

// get product data
exports.getProductService = async (id) => {
  const populateReviews = {
    path: "reviews",
    match: { status: { $ne: "Hide" } },
    populate: { path: "userId", select: "name email imageURL" },
  };
  let product = null;

  if (mongoose.Types.ObjectId.isValid(id)) {
    product = await Product.findById(id).populate(populateReviews);
  }

  if (!product) {
    product = await Product.findOne({ slug: id }).populate(populateReviews);
  }

  return product;
};

// get product data
exports.getRelatedProductService = async (productId) => {
  const currentProduct = await Product.findById(productId);

  const relatedProducts = await Product.find({
    "category.id": currentProduct.category.id,
    _id: { $ne: productId }, // Exclude the current product ID
  });
  return relatedProducts;
};

// update a product
exports.updateProductService = async (id, currProduct) => {
  const product = await Product.findById(id);
  if (product) {
    const previousBrandId = product.brand?.id?.toString();
    const previousCategoryId = product.category?.id?.toString();
    const directFields = [
      "title",
      "sku",
      "img",
      "slug",
      "unit",
      "imageURLs",
      "tags",
      "parent",
      "children",
      "price",
      "discount",
      "quantity",
      "status",
      "productType",
      "description",
      "additionalInformation",
      "featured",
      "sizes",
      "videoId",
    ];

    // Product list toggles send partial payloads; only update fields that are present.
    directFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(currProduct, field)) {
        product[field] = currProduct[field];
      }
    });

    if (currProduct.brand?.id) {
      const brand = await Brand.findById(currProduct.brand.id);
      if (!brand) {
        const error = new Error("Brand not found");
        error.statusCode = 404;
        throw error;
      }
      product.brand = { id: brand._id, name: brand.name };
    } else if (currProduct.brand?.name) {
      product.brand.name = currProduct.brand.name;
    }

    if (currProduct.category?.id) {
      const category = await Category.findById(currProduct.category.id);
      if (!category) {
        const error = new Error("Category not found");
        error.statusCode = 404;
        throw error;
      }
      product.category = { id: category._id, name: category.parent };
      product.parent = category.parent;
      product.productType = category.productType;
    } else if (currProduct.category?.name) {
      product.category.name = currProduct.category.name;
      product.parent = currProduct.category.name;
    }

    if (currProduct.offerDate) {
      product.offerDate = {
        ...(product.offerDate || {}),
        ...currProduct.offerDate,
      };
    }

    await product.save();

    const currentBrandId = product.brand?.id?.toString();
    const currentCategoryId = product.category?.id?.toString();

    if (previousBrandId && previousBrandId !== currentBrandId) {
      await Brand.updateOne(
        { _id: previousBrandId },
        { $pull: { products: product._id } }
      );
    }
    if (currentBrandId) {
      await Brand.updateOne(
        { _id: currentBrandId },
        { $addToSet: { products: product._id } }
      );
    }

    if (previousCategoryId && previousCategoryId !== currentCategoryId) {
      await Category.updateOne(
        { _id: previousCategoryId },
        { $pull: { products: product._id } }
      );
    }
    if (currentCategoryId) {
      await Category.updateOne(
        { _id: currentCategoryId },
        { $addToSet: { products: product._id } }
      );
    }
  }

  return product;
};



// get Reviews Products
exports.getReviewsProducts = async () => {
  const result = await Product.find({
    reviews: { $exists: true, $ne: [] },
  })
    .populate({
      path: "reviews",
      populate: { path: "userId", select: "name email imageURL" },
    });

  const products = result.filter(p => p.reviews.length > 0)

  return products;
};

// get Reviews Products
exports.getStockOutProducts = async () => {
  const result = await Product.find({ status: "out-of-stock" }).sort({ createdAt: -1 })
  return result;
};

// get Reviews Products
exports.deleteProduct = async (id) => {
  const result = await Product.findByIdAndDelete(id)
  if (result) {
    await Promise.all([
      Brand.updateOne(
        { _id: result.brand?.id },
        { $pull: { products: result._id } }
      ),
      Category.updateOne(
        { _id: result.category?.id },
        { $pull: { products: result._id } }
      ),
    ]);
  }
  return result;
};
