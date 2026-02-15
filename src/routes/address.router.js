import { Router } from "express";
import {
  createAddress,
  getAddrressById,
  getAllUserAddress,
  updateAddress,
} from "../controllers/address.controller.js";

const router = Router();

router.route("/create").post(createAddress);
router.route("/get_all_user_address").get(getAllUserAddress);
router.route("/get_by_id").get(getAddrressById);
router.route("/update").post(updateAddress);
router.route("/delete").delete(deleteAddress);

export default router;