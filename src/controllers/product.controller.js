import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";

const createProduct = asyncHandler(async (req, res) => {
  // input: product fields
  // validate fields
  // check if product already exists
  // create product object
  // save product in db
  // check if product is created
  // send response
  const { name, description, price, category } = req.body;

  if (
    [name, description, price, category].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required!");
  }

  const isExist = await Product.findOne({
    $and: [{ name }, { description }, { category }],
  });

  if (!isExist) {
    throw new ApiError(401, "Product already exist!");
  }

  const product = await Product.create({
    name: name,
    description: description,
    price: price,
    category: category,
  });

  if (!product) {
    throw new ApiError(500, "Something went wrong while creating new Product!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product created successfully!"));
});

const getProductById = asyncHandler(async (req, res) => {
  // input: product id
  // validate input
  // check if product exist
  // send product
  const { Id } = req.params.id;

  if (Id) {
    throw new ApiError(400, "Product id is required!");
  }

  const product = await Product.findById(Id);

  if (!product) {
    throw new ApiError(409, "Product does't exist!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, product, "Product with Id fetched successfully!")
    );
});

const getProductByName = asyncHandler(async (req, res) => {
  // input: field
  // validate input
  // check if product exist
  // send product
  const { name } = req.body;

  if (!name) {
    throw new ApiError(400, "Name field is required!");
  }

  const product = await Product.find({ name });

  if (!product) {
    throw new ApiError(400, "Product with the provided name doesn't exist!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully!"));
});

const getProductByCategory = asyncHandler(async (req, res) => {
  // input: category
  // validate input
  // check if product exist
  // send product
  const { category } = req.body;

  if (!category) {
    throw new ApiError(400, "Category field is required!");
  }

  const product = await Product.find({ category });

  if (!product) {
    throw new ApiError(409, "Product of this categort doesn't exist!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        product,
        "Products of the category is fetched successfully!"
      )
    );
});

const addProductReview = asyncHandler(async (req, res) => {
  // inputs: rating, number, product id, user id
  const { rating, comment } = req.body;
  const productId = req.params.id;
  const userId = req.user._id;

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(400, "Product not found!");
  }

  const review = {
    user: userId,
    rating: Number(rating),
    comment,
  };
  await product.reviews.push(review);

  await product.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Product review added successfully!"));
});

const deleteProduct = asyncHandler(async (req, res) => {
  // input: product id
  // validate input
  // check if product exist
  // deleting the product
  // check if product is deleted
  // rend response
  const { Id } = req.params.id;

  if (!Id) {
    throw new ApiError(400, "Product Id is required!");
  }

  const product = await Product.findById(Id);
  if (!product) {
    throw new ApiError(409, "Product with given id does't exist!");
  }

  await product.deleteOne();

  const isExist = await Product.findById(Id);

  if (isExist) {
    throw new ApiError(
      500,
      "Some error occured while deleting the product, Product not deleted!"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Product deleted sucessfully!"));
});

export {
  createProduct,
  getProductById,
  getProductByName,
  getProductByCategory,
  addProductReview,
  deleteProduct,
};