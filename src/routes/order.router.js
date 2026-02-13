import { Router } from "express";
import {
  cancelOrder,
  createOrder,
  getAllUserOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/order.controller";

const router = Router();

router.route("/create").post(createOrder);
router.route("/getById").get(getOrderById);
router.route("/getAllUserOrders").get(getAllUserOrders);
router.route("/updateStatus").post(updateOrderStatus);
router.route("/cancel").post(cancelOrder);

export default router;