const { usersService } = require("../service");
const Joi = require("joi");

const createUser = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      res.status(400).json({
        message: `missing required ${validationResult.error.details[0].path[0]} field`,
      });
      return;
    }
    const { email, password } = req.body;
    const newUser = await usersService.addUser(email, password);
    if (newUser) {
      res.status(201).json({
        email: newUser.email,
        subscription: newUser.subscription,
      });
    } else {
      res.status(409).json({ message: "Email is already in use" });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      res.status(400).json({
        message: `missing required ${validationResult.error.details[0].path[0]} field`,
      });
      return;
    }
    const { email, password } = req.body;
    const userData = await usersService.login(email, password);
    if (userData) {
      res.status(200).json(userData);
    } else {
      res.status(401).json({ message: "Email or password is wrong" });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    const isLoggedout = await usersService.logoutUser(req.user);
    if (isLoggedout) {
      res.status(204).send();
    } else {
      res.status(401).send();
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const userInfo = await usersService.findUserInfo(req.user);
    if (!userInfo) {
      res.status(401).send();
    } else {
      res.status(200).json(userInfo);
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const updateUserSubscription = async (req, res, next) => {
  const { subscription } = req.body;
  const schema = Joi.object({
    subscription: Joi.string().valid("starter", "pro", "business").required(),
  });
  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    res.status(400).json(validationResult.error.details[0].message);
    return;
  }
  try {
    const userSubscription = await usersService.updateUserSubscription(
      req.user,
      subscription
    );
    if (userSubscription) {
      res.status(200).json(userSubscription);
    } else {
      res.status(404).send();
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const updateUserAvatar = async (req, res, next) => {
  const { path: temporaryName } = req.file;
  try {
    const result = await usersService.uploadUserAvatar(req.user, temporaryName);
    res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
};

const verifyToken = async (req, res, next) => {
  const token = req.params.verificationToken;
  try {
    const tokenWasVerified = await usersService.tokenSuccessfulyVerified(token);
    if (tokenWasVerified) {
      res.status(200).json({ message: "Verification successful" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    return next(err);
  }
};

const sendVerificationEmail = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required(),
  });

  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    res.status(400).json({
      message: `missing required ${validationResult.error.details[0].path[0]} field`,
    });
    return;
  }

  const { email } = req.body;
  try {
    const result = await usersService.resendVerificationEmail(email);
    if (result) {
      res.status(200).json({ message: "Verification email sent" });
    } else {
      res.status(400).json({ message: "Verification has already been passed" });
    }
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createUser,
  login,
  logout,
  getUserInfo,
  updateUserSubscription,
  updateUserAvatar,
  verifyToken,
  sendVerificationEmail,
};
