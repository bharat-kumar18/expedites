const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required(),

  email: Joi.string()
    .email()
    .required(),

  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required(),

  password: Joi.string()
    .min(8)
    .required(),

  role: Joi.string()
    .valid(
      "CUSTOMER",
      "PICKUP_AGENT",
      "DELIVERY_AGENT",
      "ADMIN"
    )
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};