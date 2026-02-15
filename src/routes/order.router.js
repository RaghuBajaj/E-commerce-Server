import { Router } from "express";
import {
  cancelOrder,
  createOrder,
  getAllUserOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/order.controller.js";

const router = Router();

router.route("/create").post(createOrder);
router.route("/get").get(getOrderById);
router.route("/get_all_user_orders").get(getAllUserOrders);
router.route("/update_status").post(updateOrderStatus);
router.route("/cancel").post(cancelOrder);

export default router;