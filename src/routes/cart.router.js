import { Router } from "express";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../controllers/cart.controller.js";

const router = Router();

router.route("/addToCart").post(addToCart);
router.route("/get").get(getCart);
router.route("/clear").post(clearCart);
router.route("/updateItem").post(updateCartItem);
router.route("/removeItem").post(removeFromCart);

export default router;