const User = require("./schemas/user");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const fs = require("fs").promises;
const { nanoid } = require("nanoid");
const path = require("path");

const secret = process.env.SECRET;
const storeImage = path.join(process.cwd(), "public/avatars");

const addUser = async (email, password) => {
  try {
    const user = await User.findOne({ email }).lean();
    if (user) {
      return null;
    }
    const newUser = new User({
      email,
      password,
      avatarURL: gravatar.url(email),
    });
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

const uploadUserAvatar = async (user, avatarOriginalName) => {
  Jimp.read(avatarOriginalName)
    .then((avatar) => {
      return avatar.resize(250, 250);
    })
    .catch((err) => {
      console.error(err);
    });
  const newName = `${user.email}_${nanoid(5)}`;
  await User.findByIdAndUpdate(user, {
    avatarURL: `/avatars/${newName}`,
  });
  const fileName = path.join(storeImage, newName);
  console.log(path.relative);
  try {
    await fs.rename(avatarOriginalName, fileName);
  } catch (err) {
    await fs.unlink(avatarOriginalName);
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
  uploadUserAvatar,
};
