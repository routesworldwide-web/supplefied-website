const ApiError = require('../errors/api-error');
const Category = require('../model/Category');
const Products = require('../model/Products');

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
  const category = await Category.find({
    status: 'Show',
    ...getFeaturedFilter(query),
  }).populate('products');
  return category;
}

// get all category 
exports.getAllCategoryServices = async () => {
  const category = await Category.find({})
  return category;
}

// get type of category service
exports.getCategoryTypeService = async (param, query) => {
  const categories = await Category.find({
    productType: param,
    status: 'Show',
    ...getFeaturedFilter(query),
  }).populate('products');
  return categories;
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
  return result
}

// get single category
exports.getSingleCategoryService = async (id) => {
  const result = await Category.findById(id);
  return result;
}
