const express = require("express");
const ctrlContact = require("../../controller");

const router = express.Router();

router.get("/", ctrlContact.getContacts);

router.get("/:contactId", ctrlContact.getContactById);

router.post("/", ctrlContact.createNewContact);

router.delete("/:contactId", ctrlContact.deleteContact);

router.put("/:contactId", ctrlContact.updateContact);

module.exports = router;
