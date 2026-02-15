import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  updateAccessAndRefreshToken,
  updateUserPassword,
  updateUserProfile,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/update_passsword").post(updateUserPassword);
router.route("/update_token").post(updateAccessAndRefreshToken);
router.route("/update_profile").post(updateUserProfile);

export default router;