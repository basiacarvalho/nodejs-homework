const Contact = require("./schemas/contact");

const listContacts = async () => {
  try {
    return await Contact.find();
  } catch (err) {
    console.error(err.message);
  }
};

const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

const removeContact = async (contactId) => {
  try {
    return await Contact.findByIdAndRemove(contactId);
  } catch (err) {
    console.error(err.message);
    return false;
  }
};

const addContact = async (name, email, phone) => {
  try {
    return await Contact.create({ name, email, phone });
  } catch (err) {
    console.error(err.message);
  }
};

const updateContact = async (contactId, contact) => {
  try {
    return await Contact.findByIdAndUpdate(contactId, contact, {
      new: true,
    });
  } catch (err) {
    console.error(err.message);
  }
};

const updateStatusContact = async (contactId, contact) => {
  try {
    return await Contact.findByIdAndUpdate(contactId, contact, {
      new: true,
    });
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
