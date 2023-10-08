const User = require("./schemas/user");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const fs = require("fs").promises;
const { nanoid } = require("nanoid");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();

const secret = process.env.SECRET;
const storeImage = path.join(process.cwd(), "public/avatars");

const mailerConfig = {
  host: "smtp.sendgrid.net",
  port: 465,
  secure: true,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
};

const transporter = nodemailer.createTransport(mailerConfig);

const emailOptions = {
  from: process.env.VERIFICATION_FROM,
  subject: "E-mail verification",
};

const addUser = async (email, password) => {
  try {
    const user = await User.findOne({ email }).lean();
    if (user) {
      return null;
    }
    const newUser = new User({
      email,
      password,
      avatarURL: gravatar.url(email, { d: "identicon" }),
      verificationToken: nanoid(),
    });
    newUser.setPassword(password);
    await newUser.save();

    sendRegistrationEmail(newUser);
    return newUser;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const sendRegistrationEmail = (newUser) => {
  const userEmailOptions = {
    ...emailOptions,
    to: newUser.email,
    text: `Click on the link to verify your account ${process.env.VERIFICATION_ENDPOINT}${newUser.verificationToken}`,
  };

  transporter
    .sendMail(userEmailOptions)
    .then((info) => console.log(info))
    .catch((err) => console.log(err));
};

const login = async (email, password) => {
  try {
    const user = await User.findOne({ email, verify: true });
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
    throw err;
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
  const extensionIndex = avatarOriginalName.lastIndexOf(".");
  const extension = avatarOriginalName.slice(extensionIndex);
  const newName = `${user.email}_${nanoid(5)}${extension}`;
  const fileName = path.join(storeImage, newName);
  try {
    await fs.rename(avatarOriginalName, fileName);
    const updatedUser = await User.findByIdAndUpdate(
      user,
      {
        avatarURL: `/avatars/${newName}`,
      },
      {
        new: true,
      }
    );
    return { avatarURL: updatedUser.avatarURL };
  } catch (err) {
    try {
      await fs.unlink(avatarOriginalName);
    } catch (err) {
      console.error(err.message);
      throw err;
    }
    console.error(err.message);
    throw err;
  }
};

const tokenSuccessfulyVerified = async (verificationToken) => {
  try {
    console.log(verificationToken);
    const user = await User.findOneAndUpdate(
      { verificationToken },
      { verificationToken: null, verify: true }
    ).lean();
    return user !== null;
  } catch (err) {
    console.log(err.message);
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
  tokenSuccessfulyVerified,
};
