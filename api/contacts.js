const express = require("express");
const router = express.Router();
const { contactsController } = require("../controller");

router.get("/", contactsController.getContacts);

router.get("/:contactId", contactsController.getContactById);

router.post("/", contactsController.createNewContact);

router.delete("/:contactId", contactsController.deleteContact);

router.put("/:contactId", contactsController.updateContact);

router.patch("/:contactId/favorite", contactsController.updateStatusContact);

module.exports = router;
