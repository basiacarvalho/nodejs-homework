const express = require("express");
const router = express.Router();
const { contactsController } = require("../controller");
const passport = require("passport");

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!user || err) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Unauthorized",
        data: "Unauthorized",
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

router.get("/", auth, contactsController.getContacts);

router.get("/:contactId", auth, contactsController.getContactById);

router.post("/", auth, contactsController.createNewContact);

router.delete("/:contactId", auth, contactsController.deleteContact);

router.put("/:contactId", auth, contactsController.updateContact);

router.patch(
  "/:contactId/favorite",
  auth,
  contactsController.updateStatusContact
);

module.exports = router;
