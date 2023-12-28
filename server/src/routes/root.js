import express from "express";
import path from "path";
import { dirname } from "../utils/dirname.js";

const router = express.Router();

router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(
    path.join(dirname(import.meta.url), "..", "views", "index.html")
  );
});

export default router;
