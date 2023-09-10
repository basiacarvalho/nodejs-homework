const fs = require("fs").promises;
const contactsPath = "./models/contacts.json";
const { nanoid } = require("nanoid");

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

const removeContact = async (contactId) => {
  const result = await listContacts();
  const newContactList = result.filter(
    (contact) => contact.id !== `${contactId}`
  );
  try {
    fs.writeFile(contactsPath, JSON.stringify(newContactList));
    return result.length !== newContactList.length;
  } catch (err) {
    console.error(err.message);
    return false;
  }
};

const addContact = async (name, email, phone) => {
  const result = await listContacts();
  const newContact = {
    id: nanoid(),
    name: name,
    email: email,
    phone: phone,
  };
  result.push(newContact);
  try {
    fs.writeFile(contactsPath, JSON.stringify(result));
    return newContact;
  } catch (err) {
    console.error(err.message);
  }
};

const updateContact = async (contactId, { name, email, phone }) => {
  const result = await listContacts();
  const contact = result.find((el) => el.id === contactId);
  if (!contact) {
    return;
  }
  contact.name = name;
  contact.email = email;
  contact.phone = phone;
  try {
    fs.writeFile(contactsPath, JSON.stringify(result));
    return contact;
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
