const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ── Helper: create folder if it doesn't exist ──────────────────
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
};

// ── Allowed image types ────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

// ── Dynamic destination based on fieldname ─────────────────────
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "uploads/staff"; // default

    if (file.fieldname === "aadharImage") folder = "uploads/aadhar";
    else if (file.fieldname === "panImage")   folder = "uploads/pan";
    else if (file.fieldname === "profileImage") folder = "uploads/staff";

    ensureDir(folder);
    cb(null, folder);
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage, fileFilter });

module.exports = upload;