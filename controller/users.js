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
      res.status(201).json({ newUser });
    } else {
      res.status(409).json({ message: "Email is already in use" });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

module.exports = {
  createUser,
};
