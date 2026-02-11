import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  updateAccessAndRefreshToken,
  updateUserPassword,
  updateUserProfile,
} from "../controllers/user.controller";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/updatePasssword").post(updateUserPassword);
router.route("/updateToken").post(updateAccessAndRefreshToken);
router.route("/profileUpdate").post(updateUserProfile);

export default router;