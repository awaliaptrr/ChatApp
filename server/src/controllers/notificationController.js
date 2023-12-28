import { Database } from "../utils/database.js";
import jwtDecode from "jwt-decode";

const notificationsConnection =
  Database.getConnection().collection("notifications");

const getNotifications = async (req, res) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const toUsername = jwtDecode(authHeader.split(" ")[1]).person.username;

  const notifications = await notificationsConnection
    .find({ toUsername })
    .sort({ createdAt: -1 })
    .toArray();

  res.status(200).json(notifications);
};

export { getNotifications };
