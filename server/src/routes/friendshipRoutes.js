import express from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import {
  getStrangers,
  sendRequest,
  getRequested,
  acceptRequest,
  getFriends,
} from "../controllers/friendshipController.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/strangers/:username").get(getStrangers);
router.route("/strangers").get(getStrangers);

router.route("/sendRequest").post(sendRequest);

router.route("/requested").get(getRequested);

router.route("/accept").patch(acceptRequest);

router.route("/friends").get(getFriends);

export default router;
