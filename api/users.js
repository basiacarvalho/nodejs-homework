const express = require("express");
const router = express.Router();
const { usersController } = require("../controller");

router.post("/signup", usersController.createUser);

router.post("/login", usersController.login);

// router.post("/logout", ctrlUser.logout);

module.exports = router;
