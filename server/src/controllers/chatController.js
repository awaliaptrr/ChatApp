import { Database } from "../utils/database.js";
import jwtDecode from "jwt-decode";

const usersConnection = Database.getConnection().collection("users");
const chatsConnection = Database.getConnection().collection("chats");

const getSortedMessages = async (req, res) => {
  const token = req.headers.authorization || req.headers.Authorization;
  const username = jwtDecode(token.split(" ")[1]).person.username;

  const messages = await chatsConnection
    .aggregate([
      {
        $match: { key: new RegExp(`◊${username}◊`) },
      },
      {
        $group: {
          _id: "$key",
          payload: {
            $push: {
              message: "$message",
              sentAt: "$sentAt",
            },
          },
        },
      },
      {
        $unwind: "$payload",
      },
      {
        $sort: { "payload.sentAt": -1 },
      },
      {
        $group: {
          _id: "$_id",
          payload: {
            $push: {
              message: "$payload.message",
              sentAt: "$payload.sentAt",
            },
          },
        },
      },
      {
        $addFields: {
          latestPayload: { $arrayElemAt: ["$payload", 0] },
        },
      },
      {
        $sort: { "latestPayload.sentAt": -1 },
      },
      {
        $project: {
          _id: 0,
          key: "$_id",
          payload: 1,
        },
      },
    ])
    .toArray();

  const targetUsernames = [];
  const mappedMessages = messages.map((data) => {
    data.key = data.key.split("◊").filter((item) => item !== "");
    data.senderUsername = data.key[0];
    data.payload = data.payload[0];
    data.username = data.key[0] == username ? data.key[1] : data.key[0];
    delete data.key;
    targetUsernames.push(data.username);
    return data;
  });

  const uniqueMessage = {};
  mappedMessages.forEach((obj) => {
    const { username } = obj;
    if (!uniqueMessage[username]) {
      uniqueMessage[username] = obj;
    }
  });

  const filteredMessages = Object.values(uniqueMessage);

  const friends = await usersConnection
    .find({
      username: { $in: targetUsernames },
    })
    .project({ _id: 0, username: 1, name: 1, profileImage: 1, info: 1 })
    .toArray();

  const payload = {};
  friends.forEach((user) => {
    const { username, name, profileImage, info } = user;
    payload[username] = { name, profileImage, info };
  });

  res.json({ messages: filteredMessages, payload });
};

const sendChatMessage = async (req, res) => {
  const token = req.headers.authorization || req.headers.Authorization;
  const username = jwtDecode(token.split(" ")[1]).person.username;
  const { targetUsername, message } = req.body;
  const timeStamp = new Date();

  chatsConnection.insertOne({
    key: `◊${username}◊${targetUsername}◊`,
    message,
    sentAt: timeStamp,
  });

  res.json({
    payload: { message, sentAt: timeStamp },
    senderUsername: username,
    username: targetUsername,
  });
};

const getMessagesPerUser = async (req, res) => {
  const token = req.headers.authorization || req.headers.Authorization;
  const username = jwtDecode(token.split(" ")[1]).person.username;
  const targetUsername = req.params.targetUsername;

  const messages = await chatsConnection
    .find({
      $and: [
        { key: new RegExp(`◊${username}◊`) },
        { key: new RegExp(`◊${targetUsername}◊`) },
      ],
    })
    .sort({ sentAt: 1 })
    .project({ _id: 0 })
    .toArray();

  const mappedMessages = messages.map((data) => {
    data.key = data.key.split("◊").filter((item) => item !== "");
    return data;
  });
  res.json(mappedMessages);
};

export { getSortedMessages, sendChatMessage, getMessagesPerUser };
