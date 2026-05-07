const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ── Helper: create folder if it doesn't exist ──────────────────
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
};

// ── Allowed image types ────────────────────────────────────────
const ALLOWED_TYPES = /jpeg|jpg|png|webp/;
const ALLOWED_LABEL = "JPG, JPEG, PNG, or WEBP";

const fileFilter = (req, file, cb) => {
  const ext     = path.extname(file.originalname).toLowerCase().replace(".", "");
  const extOk   = ALLOWED_TYPES.test(ext);
  const mimeOk  = ALLOWED_TYPES.test(file.mimetype);

  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    // This error will be caught by the route-level error handler
    cb(new Error(`Invalid file type ".${ext}". Only ${ALLOWED_LABEL} images are allowed.`));
  }
};

// ── Dynamic destination based on fieldname ─────────────────────
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "uploads/staff"; // default

    if (file.fieldname === "aadharImage")   folder = "uploads/aadhar";
    else if (file.fieldname === "panImage") folder = "uploads/pan";
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