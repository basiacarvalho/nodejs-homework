const contacts = require("../models/contacts");
const Joi = require("joi");

const getContacts = async (_, res, next) => {
  const contactList = await contacts.listContacts();
  res.json(contactList);
};

const getContactById = async (req, res, next) => {
  const contact = await contacts.getContactById(req.params.contactId);
  if (contact) {
    res.json(contact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
};

const createNewContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  });

  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    res.status(400).json({
      message: `missing required ${validationResult.error.details[0].path[0]} field`,
    });
    return;
  }
  const newContact = await contacts.addContact(name, email, phone);
  if (newContact) {
    res.status(201).json({ newContact });
  }
};

const deleteContact = async (req, res, next) => {
  const isDeleted = await contacts.removeContact(req.params.contactId);
  if (isDeleted) {
    res.status(200).json({ message: "contact deleted" });
  } else {
    res.status(404).json({ message: "Not found" });
  }
};

const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  });

  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    res.status(400).json({
      message: "missing fields",
    });
    return;
  }
  const updatedContact = await contacts.updateContact(contactId, req.body);
  if (updatedContact) {
    res.status(200).json(updatedContact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
};

module.exports = {
  getContacts,
  getContactById,
  createNewContact,
  deleteContact,
  updateContact,
};
