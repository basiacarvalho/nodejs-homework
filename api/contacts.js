const express = require("express");
const router = express.Router();
const { contactsController } = require("../controller");
const auth = require("./auth");

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
