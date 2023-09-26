const express = require("express");
const router = express.Router();
const { usersController } = require("../controller");
const auth = require("./auth");

router.post("/signup", usersController.createUser);

router.post("/login", usersController.login);

router.get("/logout", usersController.logout);

router.get("/current", auth, usersController.getUserInfo);

router.patch("/", auth, usersController.updateUserSubscription);

module.exports = router;
