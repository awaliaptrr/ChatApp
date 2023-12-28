import jwtDecode from "jwt-decode";
import { Database } from "../utils/database.js";

const usersConnection = Database.getConnection().collection("users");
const notificationsConnection =
  Database.getConnection().collection("notifications");
const friendshipsConnection =
  Database.getConnection().collection("friendships");

const getStrangers = async (req, res) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const username = jwtDecode(authHeader.split(" ")[1]).person.username;
  const searchName = req.params.username;

  const friendships = await friendshipsConnection
    .find({ key: new RegExp(`◊${username}◊`) })
    .toArray();

  const friendshipsFiltered = friendships.map((data) =>
    data.key.split("◊").filter((item) => item !== "")
  );

  const friends = [];

  for (const friendship of friendshipsFiltered) {
    friends.push(friendship[0] == username ? friendship[1] : friendship[0]);
  }

  let strangers;

  if (searchName) {
    strangers = await usersConnection
      .find({
        name: new RegExp(searchName, "i"),
        username: { $nin: [...friends, username] },
      })
      .project({ _id: 0, username: 1, name: 1, info: 1, profileImage: 1 })
      .toArray();
  } else {
    strangers = await usersConnection
      .find({ username: { $nin: [...friends, username] } })
      .project({ _id: 0, username: 1, name: 1, info: 1, profileImage: 1 })
      .toArray();
  }

  res.status(200).json(strangers);
};

const sendRequest = async (req, res) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const username = jwtDecode(authHeader.split(" ")[1]).person.username;
  const targetUsername = req.body.targetUsername;

  const [user] = await usersConnection.find({ username }).toArray();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  friendshipsConnection.insertOne({
    key: `◊${username}◊${targetUsername}◊`,
    status: "requested",
  });

  notificationsConnection.insertOne({
    toUsername: targetUsername,
    image: user.profileImage,
    type: "friendship",
    message: `${user.name} has sent you a friend request.`,
    createdAt: new Date(),
  });

  res.status(200).json({ message: "done" });
};

const getRequested = async (req, res) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const username = jwtDecode(authHeader.split(" ")[1]).person.username;

  const friendships = await friendshipsConnection
    .find({
      key: new RegExp(`\\w◊${username}◊`),
      status: "requested",
    })
    .toArray();

  const friendshipsFiltered = friendships.map((data) =>
    data.key.split("◊").filter((item) => item !== "")
  );

  const strangers = [];

  for (const friendship of friendshipsFiltered) {
    strangers.push(friendship[0] == username ? friendship[1] : friendship[0]);
  }

  const requests = await usersConnection
    .find({
      username: { $in: strangers },
    })
    .project({ _id: 0, username: 1, name: 1, info: 1, profileImage: 1 })
    .toArray();

  res.status(200).json(requests);
};

const acceptRequest = async (req, res) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const username = jwtDecode(authHeader.split(" ")[1]).person.username;
  const targetUsername = req.body.username;

  await friendshipsConnection.updateOne(
    { key: `◊${targetUsername}◊${username}◊` },
    { $set: { status: "accepted" } }
  );

  const [user] = await usersConnection.find({ username }).toArray();

  notificationsConnection.insertOne({
    toUsername: targetUsername,
    image: user.profileImage,
    type: "friendship",
    message: `${user.name} has accepted your friend request.`,
    createdAt: new Date(),
  });

  res.status(200).json({ message: "Done" });
};

const getFriends = async (req, res) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const username = jwtDecode(authHeader.split(" ")[1]).person.username;

  const friendships = await friendshipsConnection
    .find({
      key: new RegExp(`◊${username}◊`),
      status: "accepted",
    })
    .toArray();

  const friendshipsFiltered = friendships.map((data) =>
    data.key.split("◊").filter((item) => item !== "")
  );

  const friendUsernames = [];

  for (const friendship of friendshipsFiltered) {
    friendUsernames.push(
      friendship[0] == username ? friendship[1] : friendship[0]
    );
  }

  const friends = await usersConnection
    .find({
      username: { $in: friendUsernames },
    })
    .project({ _id: 0, username: 1, name: 1, info: 1, profileImage: 1 })
    .toArray();

  res.status(200).json(friends);
};

export { getStrangers, sendRequest, getRequested, acceptRequest, getFriends };
