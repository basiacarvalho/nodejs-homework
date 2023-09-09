const express = require("express");
const contacts = require("../../models/contacts");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const contactList = await contacts.listContacts();
  res.json(contactList);
});

router.get("/:contactId", async (req, res, next) => {
  const contact = await contacts.getContactById(req.params.contactId);
  res.json(contact);
});

router.post("/", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.delete("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router;
