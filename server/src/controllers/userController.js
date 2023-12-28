import { Database } from "../utils/database.js";
import jwtDecode from "jwt-decode";

const connection = Database.getConnection().collection("users");

const getCurrentProfileData = async (req, res) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const username = jwtDecode(authHeader.split(" ")[1]).person.username;

  const [user] = await connection.find({ username }).toArray();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    name: user.name,
    info: user.info,
    profileImage: user.profileImage,
  });
};

const update = async (req, res) => {
  //TEMP
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const username = jwtDecode(authHeader.split(" ")[1]).person.username;
  const { name, info } = req.body;

  const [user] = await connection.find({ username }).toArray();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.name != name) {
    await connection.updateOne({ username }, { $set: { name } });
  }

  if (user.info != info) {
    await connection.updateOne({ username }, { $set: { info } });
  }

  res.status(200).json({
    message: "success",
  });
};

const updateProfileImage = async (req, res) => {
  const profileImage = req.file.filename;

  await connection.updateOne({ username }, { $set: { profileImage } });

  res.status(200).json(profileImage);
};

export { getCurrentProfileData, update, updateProfileImage };
