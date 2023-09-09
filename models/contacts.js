const fs = require("fs").promises;
const contactsPath = "./models/contacts.json";

const listContacts = async () => {
  try {
    const contacts = await fs.readFile(contactsPath, { encoding: "utf8" });
    return JSON.parse(contacts);
  } catch (err) {
    console.error(err.message);
  }
};

const getContactById = async (contactId) => {
  const result = await listContacts();
  const contact = result.find((contact) => contact.id === `${contactId}`);
  return contact;
};

const removeContact = async (contactId) => {};

const addContact = async (body) => {};

const updateContact = async (contactId, body) => {};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
