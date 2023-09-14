const express = require("express");
const router = express.Router();
const ctrlContact = require("../controller");

router.get("/", ctrlContact.getContacts);

router.get("/:contactId", ctrlContact.getContactById);

router.post("/", ctrlContact.createNewContact);

router.delete("/:contactId", ctrlContact.deleteContact);

router.put("/:contactId", ctrlContact.updateContact);

router.patch("/:contactId/favorite", ctrlContact.updateStatusContact);

module.exports = router;
