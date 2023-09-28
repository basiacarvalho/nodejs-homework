const Contact = require("./schemas/contact");

const listContacts = async (owner, page, limit, favorite) => {
  try {
    const filter = { owner };
    if (favorite !== undefined) {
      filter.favorite = favorite;
    }

    const result = await Contact.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Contact.count(filter);

    return {
      result,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const getContactById = async (owner, contactId) => {
  return await Contact.findOne({ _id: contactId, owner });
};

const removeContact = async (owner, contactId) => {
  try {
    return await Contact.findOneAndDelete({ _id: contactId, owner });
  } catch (err) {
    console.error(err.message);
    return false;
  }
};

const addContact = async (owner, name, email, phone) => {
  try {
    return await Contact.create({ name, email, phone, owner: owner });
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const updateContact = async (owner, contactId, contact) => {
  try {
    return await Contact.findOneAndUpdate(
      { _id: contactId, owner: owner },
      contact,
      {
        new: true,
      }
    );
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const updateStatusContact = async (owner, contactId, favorite) => {
  try {
    return await Contact.findOneAndUpdate(
      { _id: contactId, owner },
      { favorite },
      {
        new: true,
      }
    );
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
