import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";

const addToCart = asyncHandler(async (req, res) => {
  // input: product id, user id, quantity
  // find cart from user id, if not the create cart and save cart id to User
  // check if product exist in the cart items list with product id
  // create product in the items or update quantity
  // save the cart
  // send cart in response
  const { productId, quantity = 1 } = req.body;
  const userId = req.user._id;

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found!");
  }

  const cart = await Cart.find({ owner: userId });

  if (!cart) {
    cart = await Cart.create({
      owner: userId,
      items: [],
    });
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found!");
    }
    user["cart"] = cart;
    await user.save();
  }

  const existingItem = cart.items.find(
    (item) => item?.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    const createItem = {
      product: productId,
      quantity,
      price: product.price,
    };
    await cart.items.push(createItem);
  }

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Item added to cart successfully!"));
});

const getCart = asyncHandler(async (req, res) => {
  // input: user id
  // find cart from user id
  // send cart or create a cart with the owner: user id and empty items list
  // send cart in response
  const userId = req.user._id;

  const cart = await Cart.find({ owner: userId });

  if (!cart) {
    return res.status(200).json(new ApiResponse(200, [], "Cart is empty!"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart is fetched successfully!"));
});

const updateCartItem = asyncHandler(async (req, res) => {
  // input: product id, quantity, user id
  // check if quantity < 1
  // find cart with user id
  // check product in the cart items list with product id
  // update the quantity of the product
  // save cart
  // send cart in response
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  if (quantity < 1) {
    throw new ApiError(400, "Quantity must be greater then 0!");
  }

  const cart = await Cart.find({ owner: userId });

  if (!cart) {
    throw new ApiError(404, "Invalid update request! Cart is not present!");
  }

  const item = cart.items.find(
    (item) => item?.product.toStrong() === productId
  );

  if (!item) {
    throw new ApiError(
      404,
      "Invalid update request! Product not found in the cart!"
    );
  }

  item.quantity = quantity;

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart item is updated successfully!"));
});

const removeFromCart = asyncHandler(async (req, res) => {
  // input: product id, user id
  // find cart from user id
  // find product in cart items list with product id
  // filter items list by product id
  // save cart
  // send cart in response
  const productId = req.body;
  const userId = req.user._id;

  const cart = await Cart.find({ owner: userId });

  if (!cart) {
    throw new ApiError(400, "Cant not found!");
  }

  cart.items = cart.items.filter(
    (item) => item?.product.toString() !== productId
  );

  await cart.save();

  return res
    .status(200)
    .json(200, cart, "Product is removed from the cart's items list!");
});

const clearCart = asyncHandler(async (req, res) => {
  // input user id
  // find cart from user id
  // update cart items list to empty array []
  // save cart
  // send ccart in response
  const userId = req.user._id;

  const cart = await Cart.find({ owmer: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found!");
  }

  cart.items = [];
  cart.cartTotal = 0;
  cart.finalTotal = 0;
  await cart.save();

  return res.status(200).json(200, {}, "Cart has been cleared successfully!");
});

export { addToCart, getCart, updateCartItem, removeFromCart, clearCart };