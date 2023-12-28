import { format } from "date-fns";
import { v4 } from "uuid";
import fs from "fs/promises";
import path from "path";
import { dirname } from "../utils/dirname.js";

const __dirname = dirname(import.meta.url);

const logEvent = async (message, logFileName) => {
  const dateTime = format(new Date(), "yyyyMMdd\tHH:mm:ss");
  const logItem = `${dateTime}\t${v4()}\t${message}\n`;
  const logDirPath = path.join(__dirname, "../..", "logs");

  try {
    await fs.access(logDirPath, fs.constants.F_OK);
    await fs.appendFile(path.join(logDirPath, logFileName), logItem);
  } catch (err) {
    if (err.code === "ENOENT") {
      try {
        await fs.mkdir(logDirPath);
        await fs.appendFile(path.join(logDirPath, logFileName), logItem);
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log(err);
    }
  }
};

const logger = (req, res, next) => {
  logEvent(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLogs.log");
  next();
};

export { logEvent, logger };
