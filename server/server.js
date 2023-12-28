import { config } from "dotenv";
import "express-async-errors";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { corsOptions } from "./src/config/corsOptions.js";
import { logger } from "./src/middlewares/logger.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import { dirname } from "./src/utils/dirname.js";
import { Server } from "socket.io";
import {
  root,
  authRoutes,
  userRoutes,
  friendshipRoutes,
  notificationRoutes,
  chatRoutes,
} from "./src/routes/index.js";
import { Database } from "./src/utils/database.js";
import { v4 } from "uuid";

config();

const usersConnection = Database.getConnection().collection("users");

const app = express();
const PORT = process.env.PORT || 4000;

app.use("/", express.static(path.join(dirname(import.meta.url), "public")));
app.use(
  "/images",
  express.static(path.join(dirname(import.meta.url), "files/images/profiles"))
);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(logger);

app.use("/v1", root);
app.use("/v1/auth", authRoutes);
app.use("/v1/user", userRoutes);
app.use("/v1/friendship", friendshipRoutes);
app.use("/v1/notification", notificationRoutes);
app.use("/v1/chat", chatRoutes);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(
      path.join(dirname(import.meta.url), "src", "views", "404.html")
    );
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["http://localhost:5174", "http://localhost:5173"],
  },
});

const connectedUser = {};

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("add_user", (username) => {
    connectedUser[username] = socket.id;
  });

  socket.on("join_room", async (room) => {
    socket.join(room);
  });

  socket.on("leave_room", async (room) => {
    socket.leave(room);
  });

  socket.on("send_message", async (data) => {
    socket
      .to(data.room)
      .emit("receive_message", { message: data.message, sender: data.sender });
  });

  socket.on("send_notification", async (data) => {
    console.log("notiff");
    const [user] = await usersConnection
      .find({ username: data.username })
      .toArray();
    socket.to(connectedUser[data.targetUsername]).emit("receive_notification", {
      _id: v4(),
      message: `${user.name} has sent you a friend request.`,
      createdAt: data.sentAt,
      image: user.profileImage,
    });
  });

  socket.on("delete_user", (username) => {
    console.log(username);
    delete connectedUser[username];
  });
});

// setInterval(async () => {
//   const scs = await io.fetchSockets();
//   console.log("koneksi " + scs.length);
//   console.log(connectedUser);
// }, 3000);
