const Joi = require("joi");


// ========================================
// UPDATE USER
// ========================================

const updateUserSchema = Joi.object({

  name: Joi.string()
    .min(2)
    .max(100)
    .required(),

  email: Joi.string()
    .email()
    .required(),

  phone: Joi.string()
    .pattern(/^[6-9][0-9]{9}$/)
    .required(),

});


// ========================================
// STATUS
// ========================================

const updateStatusSchema = Joi.object({

  status: Joi.string()
    .valid(
      "ACTIVE",
      "INACTIVE",
      "BLOCKED"
    )
    .required(),

});


module.exports = {
  updateUserSchema,
  updateStatusSchema,
};