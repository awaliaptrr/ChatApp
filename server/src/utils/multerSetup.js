import multer, { MulterError } from "multer";
import path from "path";
import { dirname } from "../utils/dirname.js";

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(
        null,
        path.join(dirname(import.meta.url), "../../files/images/profiles")
      );
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      cb(new MulterError("FILE_TYPE_ERROR"), false);
    }
  },
});

export { upload };
