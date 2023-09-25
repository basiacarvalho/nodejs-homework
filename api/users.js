const express = require("express");
const router = express.Router();
const { usersController } = require("../controller");

router.post("/signup", usersController.createUser);

router.post("/login", usersController.login);

router.get("/logout", usersController.logout);

module.exports = router;
