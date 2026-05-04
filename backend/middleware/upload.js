const multer = require("multer");
const path = require("path");

// Storage configuration
const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    // save inside uploads/staff
    cb(null, "uploads/staff/");
  },

  filename: function (req, file, cb) {

    const uniqueName =
      Date.now() + "-" + file.originalname;

    cb(null, uniqueName);
  },
});

// Allow only image files
const fileFilter = (req, file, cb) => {

  const allowedTypes =
    /jpeg|jpg|png|webp/;

  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimetype = allowedTypes.test(
    file.mimetype
  );

  if (extname && mimetype) {

    cb(null, true);

  } else {

    cb(new Error("Only image files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;