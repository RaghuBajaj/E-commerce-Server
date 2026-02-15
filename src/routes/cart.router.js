import { Router } from "express";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../controllers/cart.controller.js";

const router = Router();

router.route("/add").post(addToCart);
router.route("/get").get(getCart);
router.route("/clear").post(clearCart);
router.route("/update_item").post(updateCartItem);
router.route("/remove_item").post(removeFromCart);

export default router;