import express from "express";
import { verifyJWT } from "./../middlewares/verifyJWT.js";
import { upload } from "../utils/multerSetup.js";
import {
  getCurrentProfileData,
  update,
  updateProfileImage,
} from "../controllers/userController.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/current").get(getCurrentProfileData);

router.route("/update").patch(update);

router
  .route("/profileImage")
  .patch(upload.single("profileImage"), updateProfileImage);

export default router;
