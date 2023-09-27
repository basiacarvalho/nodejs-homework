const { contactsService } = require("../service");
const Joi = require("joi");

const getContacts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, favorite } = req.query;
    const result = await contactsService.listContacts(
      req.user,
      page,
      limit,
      favorite
    );
    res.json(result);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const contact = await contactsService.getContactById(
      req.user,
      req.params.contactId
    );
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
    const { name, email, phone } = req.body;
    const newContact = await contactsService.addContact(
      req.user,
      name,
      email,
      phone
    );
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
    const isDeleted = await contactsService.removeContact(
      req.user,
      req.params.contactId
    );
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
      req.user,
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
      req.user,
      contactId,
      req.body.favorite
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
