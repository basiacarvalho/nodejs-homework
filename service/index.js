const Contact = require("./schemas/contact");

const listContacts = () => {
  try {
    return Contact.find();
  } catch (err) {
    console.error(err.message);
  }
};

const getContactById = (contactId) => {
  return Contact.findById(contactId);
};

const removeContact = (contactId) => {
  try {
    return Contact.findByIdAndRemove(contactId);
  } catch (err) {
    console.error(err.message);
    return false;
  }
};

const addContact = (name, email, phone) => {
  try {
    return Contact.create({ name, email, phone });
  } catch (err) {
    console.error(err.message);
  }
};

const updateContact = (contactId, contact) => {
  try {
    return Contact.findByIdAndUpdate({ _id: contactId }, contact, {
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
};
