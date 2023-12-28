import expess from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { getNotifications } from "../controllers/notificationController.js";

const router = expess.Router();

router.use(verifyJWT);

router.route("/").get(getNotifications);

export default router;
