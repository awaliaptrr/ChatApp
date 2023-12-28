import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import { Database } from "../utils/database.js";

config();

const connection = Database.getConnection().collection("users");

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const [user] = await connection.find({ username }).toArray();

  if (!user) {
    return res
      .status(401)
      .json({ message: "Username or Password is not correct" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res
      .status(401)
      .json({ message: "Username or Password is not correct" });
  }

  //TESTING
  const accessToken = jwt.sign(
    {
      person: {
        username: user.username,
        roles: user.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ token: accessToken });
};

const check = async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[A-Za-z]{2,4}/;
  if (!emailRegex.test(email)) {
    return res.status(422).json({ message: "Email is not valid" });
  }

  let [user] = await connection.find({ email }).toArray();

  if (user) {
    return res.status(409).json({
      message: "The email is already taken. Please choose a different email",
    });
  }

  [user] = await connection.find({ username }).toArray();

  if (user) {
    return res.status(409).json({
      message:
        "The username is already taken. Please choose a different username",
    });
  }

  res.status(200).json({ success: true });
};

const register = async (req, res) => {
  const { email, username, password, name, gender, birthDate } = req.body;
  let filename;

  if (!req.file) {
    filename = "defaultProfileImage.png";
  } else {
    filename = req.file.filename;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await connection.insertOne({
    name,
    info: "Available",
    gender,
    birthDate: new Date(birthDate),
    username,
    email,
    password: hashedPassword,
    profileImage: filename,
    roles: ["user"],
    createdAt: new Date(
      new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000
    ),
    coba: true,
  });

  //TESTING
  const accessToken = jwt.sign(
    {
      person: {
        username,
        roles: ["user"],
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({ token: accessToken });
};

const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.status(401).json({ message: "Cookies not found" });
  }

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const [user] = await connection
        .find({ username: decoded.username })
        .toArray();

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const accessToken = jwt.sign(
        {
          person: {
            username: user.username,
            roles: user.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ token: accessToken });
    }
  );
};

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({ message: "Logout success" });
};

export { login, check, register, refresh, logout };
