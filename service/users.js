const User = require("./schemas/user");

const addUser = async (email, password) => {
  try {
    const user = await User.findOne({ email }).lean();
    if (user) {
      return null;
    }
    const newUser = new User({ email, password });
    newUser.setPassword(password);
    await newUser.save();
    return newUser;
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  addUser,
};
