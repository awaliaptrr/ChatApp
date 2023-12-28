import express from "express";
import { upload } from "../utils/multerSetup.js";
import {
  login,
  register,
  check,
  refresh,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

router.route("/login").post(login);

router.route("/check").post(check);

router.route("/register").post(upload.single("profileImage"), register);

router.route("/refresh").get(refresh);

router.route("/logout").post(logout);

export default router;
