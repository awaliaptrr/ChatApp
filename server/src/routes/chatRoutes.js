import express from "express";
import {
  getSortedMessages,
  sendChatMessage,
  getMessagesPerUser,
} from "../controllers/chatController.js";

const router = express.Router();

router.route("/getSortedMessages").get(getSortedMessages);

router.route("/sendMessage").post(sendChatMessage);

router.route("/getMessagesPerUser/:targetUsername").get(getMessagesPerUser);

export default router;
