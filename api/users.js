const express = require("express");
const router = express.Router();
const { usersController } = require("../controller");
const auth = require("./auth");
const multer = require("multer");
const path = require("path");

const uploadDir = path.join(process.cwd(), "tmp");

const storage = multer.diskStorage({
  destination: (req, _, cb) => {
    cb(null, uploadDir);
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1048576,
  },
});

const upload = multer({
  storage: storage,
});

router.post("/signup", usersController.createUser);

router.post("/login", usersController.login);

router.get("/logout", auth, usersController.logout);

router.get("/current", auth, usersController.getUserInfo);

router.patch("/", auth, usersController.updateUserSubscription);

router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  usersController.updateUserAvatar
);

module.exports = router;
