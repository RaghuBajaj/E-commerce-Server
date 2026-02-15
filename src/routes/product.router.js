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
router.route("/getById/:id").get(getProductById);
router.route("/getByName").get(getProductByName);
router.route("/getByCategory").get(getProductByCategory);
router.route("/addReview").post(addProductReview);
router.route("/delete").delete(deleteProduct);

export default router;