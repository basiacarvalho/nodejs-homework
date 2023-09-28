const User = require("./schemas/user");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

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
    throw err;
  }
};

const login = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user || !user.validPassword(password)) {
      return null;
    } else {
      const payload = {
        id: user.id,
        username: user.email,
      };

      const token = jwt.sign(payload, secret, { expiresIn: "1h" });
      user.token = token;
      await user.save();
      return {
        token: token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      };
    }
  } catch (err) {
    console.error(err.message);
  }
};

const logoutUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return false;
    }
    user.token = null;
    await user.save();
    return true;
  } catch (err) {
    console.error(err.message);
  }
};

const findUserInfo = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      email: user.email,
      subscription: user.subscription,
    };
  } catch (err) {
    console.error(err.message);
  }
};

const updateUserSubscription = async (userId, subscription) => {
  try {
    return await User.findByIdAndUpdate(
      userId,
      {
        subscription,
      },
      {
        new: true,
      }
    );
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

module.exports = {
  addUser,
  login,
  logoutUser,
  findUserInfo,
  updateUserSubscription,
};
