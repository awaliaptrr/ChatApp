import { logEvent } from "./logger.js";
import { MulterError } from "multer";

export const errorHandler = (err, req, res, next) => {
  const mongoError = err.errInfo?.details;

  logEvent(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLogs.log"
  );

  const status = res.statusCode ? res.statusCode : 500;

  if (mongoError?.operatorName === "$jsonSchema") {
    return res.status(status).json({
      message: mongoError.schemaRulesNotSatisfied,
      isError: true,
    });
  }

  if (err instanceof MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ message: "File too large", isError: true });
    } else if (err.code === "FILE_TYPE_ERROR") {
      return res
        .status(422)
        .json({ message: "File type not supported", isError: true });
    }
  }

  res.status(status).json({ message: err.message, isError: true });
};
