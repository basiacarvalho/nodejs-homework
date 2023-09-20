const { contactsService } = require("../service");
const Joi = require("joi");

const getContacts = async (_, res, next) => {
  try {
    const contactList = await contactsService.listContacts();
    res.json(contactList);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const contact = await contactsService.getContactById(req.params.contactId);
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const createNewContact = async (req, res, next) => {
  try {
    const Joi = require("joi");
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
    const newContact = await contactsService.addContact(name, email, phone);
    if (newContact) {
      res.status(201).json({ newContact });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const isDeleted = await contactsService.removeContact(req.params.contactId);
    if (isDeleted) {
      res.status(200).json({ message: "contact deleted" });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const updateContact = async (req, res, next) => {
  try {
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
    const updatedContact = await contactsService.updateContact(
      contactId,
      req.body
    );
    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const schema = Joi.object({
      favorite: Joi.boolean(),
    });

    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      res.status(400).json({
        message: "missing favorite field",
      });
      return;
    }
    const updatedStatusContact = await contactsService.updateStatusContact(
      contactId,
      req.body
    );
    if (updatedStatusContact) {
      res.status(200).json(updatedStatusContact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

module.exports = {
  getContacts,
  getContactById,
  createNewContact,
  deleteContact,
  updateContact,
  updateStatusContact,
};
