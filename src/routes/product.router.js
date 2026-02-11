import { Router } from "express";
import {
  getProductByCategory,
  getProductByName,
  createProduct,
  getProductById,
  deleteProduct,
  addProductReview,
} from "../controllers/product.controller.js";

const router = Router();

router.route("/create").post(createProduct);
router.route("/getById/:id").post(getProductById);
router.route("/getByName").post(getProductByName);
router.route("/getByCategory").post(getProductByCategory);
router.route("/addReview").post(addProductReview);
router.route("/delete").post(deleteProduct);

export default router;