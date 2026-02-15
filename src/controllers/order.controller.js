import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";
import { User } from "../models/user.model.js";

const createOrder = asyncHandler(async (req, res) => {
  // input: cart id, user id, addressId
  // find cart from cart id
  // find address from user id
  // create order object with info from cart, userId, addressId
  // save order in db
  // send order id in response
  const addressId = req.body;
  const userId = req.user._id;

  const cart = await Cart.find({ owner: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found!");
  }

  const newOrder = {
    items: cart.items,
    owner: userId,
    orderTotal: cart.finalTotal,
    status: "Pending",
    address: addressId,
  };

  const order = await Order.create(newOrder);

  if (!order) {
    throw new ApiError(500, "Some error occured while creating order!");
  }

  cart.items = [];
  await cart.save();

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  if (!user.orders) {
    user["orders"] = [];
  } 

  user.orders.push(newOrder);
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order created successfully!"));
});

const getOrderById = asyncHandler(async (req, res) => {
  // input: order id,
  // find order by order id
  // send order in response
  const { orderId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order fetched successfully!"));
});

const getAllUserOrders = asyncHandler(async (req, res) => {
  // input: userid
  // find order from userid
  // send all orders in response
  const userId = req.user._id;

  const order = await Order.find({ owner: userId });

  if (!order) {
    return res.status(200).json(200, [], "No order exist!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        order,
        "All orders of the user fetched successfully!"
      )
    );
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  // input: order id, status
  // find order
  // update order status
  // save order
  // send response
  const { orderId, status } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found!");
  }

  order.status = status;
  await order.save();

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order status updated successfully!"));
});

const cancelOrder = asyncHandler(async (req, res) => {
  // input: order Id
  // find order from order id
  // change order status to "cancelled"
  // save order
  // send response
  const orderId = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found!");
  }

  order.status = "Cancelled";
  await order.save();

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order cancelled successfully!"));
});

export {
  createOrder,
  getOrderById,
  getAllUserOrders,
  updateOrderStatus,
  cancelOrder,
};