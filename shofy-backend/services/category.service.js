const ApiError = require('../errors/api-error');
const Category = require('../model/Category');
const Products = require('../model/Products');

const normalizeCategoryName = (value = '') => value.trim().toLowerCase();

const attachCurrentProducts = async (categories) => {
  if (!categories.length) {
    return [];
  }

  const categoryIds = categories.map((category) => category._id);
  const categoryIdSet = new Set(categoryIds.map((id) => id.toString()));
  const categoryIdByName = categories.reduce((result, category) => {
    result[normalizeCategoryName(category.parent)] = category._id.toString();
    return result;
  }, {});
  const products = await Products.find({});

  const productsByCategory = products.reduce((result, product) => {
    const categoryNameId =
      categoryIdByName[normalizeCategoryName(product.category?.name)];
    const parentNameId =
      categoryIdByName[normalizeCategoryName(product.parent)];
    const storedCategoryId = product.category?.id?.toString();
    const categoryId =
      categoryNameId ||
      parentNameId ||
      (categoryIdSet.has(storedCategoryId) ? storedCategoryId : null);

    if (categoryId) {
      if (!result[categoryId]) {
        result[categoryId] = [];
      }
      result[categoryId].push(product);
    }

    return result;
  }, {});

  return categories.map((category) => ({
    ...category.toObject(),
    products: productsByCategory[category._id.toString()] || [],
  }));
};

const getFeaturedFilter = (query = {}) => {
  if (query.featured === true || query.featured === 'true') {
    return { featured: true };
  }

  return {};
}

// create category service
exports.createCategoryService = async (data) => {
  const category = await Category.create(data);
  return category;
}

// create all category service
exports.addAllCategoryService = async (data) => {
  await Category.deleteMany()
  const category = await Category.insertMany(data);
  return category;
}

// get all show category service
exports.getShowCategoryServices = async (query) => {
  const categories = await Category.find({
    status: 'Show',
    ...getFeaturedFilter(query),
  });
  return attachCurrentProducts(categories);
}

// get all category 
exports.getAllCategoryServices = async () => {
  const categories = await Category.find({});
  return attachCurrentProducts(categories);
}

// get type of category service
exports.getCategoryTypeService = async (param, query) => {
  const categories = await Category.find({
    productType: param,
    status: 'Show',
    ...getFeaturedFilter(query),
  });
  return attachCurrentProducts(categories);
}

// get type of category service
exports.deleteCategoryService = async (id) => {
  const result = await Category.findByIdAndDelete(id);
  return result;
}

// update category
exports.updateCategoryService = async (id,payload) => {
  const isExist = await Category.findOne({ _id:id })

  if (!isExist) {
    throw new ApiError(404, 'Category not found !')
  }

  const allowedFields = [
    'img',
    'parent',
    'children',
    'productType',
    'description',
    'products',
    'featured',
    'status',
  ];

  const updatePayload = allowedFields.reduce((data, field) => {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      data[field] = payload[field];
    }
    return data;
  }, {});

  const result = await Category.findOneAndUpdate({ _id:id }, updatePayload, {
    new: true,
  })

  // Products store category details for fast reads. Keep those live references
  // synchronized when an administrator renames or reclassifies a category.
  const productUpdate = {};
  if (Object.prototype.hasOwnProperty.call(updatePayload, 'parent')) {
    productUpdate['category.name'] = result.parent;
    productUpdate.parent = result.parent;
    productUpdate['category.id'] = result._id;
  }
  if (Object.prototype.hasOwnProperty.call(updatePayload, 'productType')) {
    productUpdate.productType = result.productType;
  }

  if (Object.keys(productUpdate).length > 0) {
    await Products.updateMany(
      {
        $or: [
          { 'category.id': result._id },
          { 'category.name': isExist.parent },
          { parent: isExist.parent },
        ],
      },
      { $set: productUpdate }
    );
  }

  return result
}

// get single category
exports.getSingleCategoryService = async (id) => {
  const result = await Category.findById(id);
  return result;
}
