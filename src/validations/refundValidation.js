const {
  body,
  validationResult
} = require("express-validator");


const validate = (
  req,
  res,
  next
) => {

  const errors =
    validationResult(req);

  if (!errors.isEmpty()) {

    return res.status(400).json({

      success: false,

      message: "Validation failed",

      errors: errors.array()

    });

  }

  next();

};


const createRefundValidation = [

  body("payment_id")
    .isUUID()
    .withMessage(
      "Valid payment_id is required"
    ),

  body("refund_amount")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage(
      "Invalid refund amount"
    ),

  body("refund_reason")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage(
      "Invalid refund reason"
    ),

  validate

];


const processRefundValidation = [

  body("refund_id")
    .isUUID()
    .withMessage(
      "Valid refund_id is required"
    ),

  validate

];


module.exports = {

  createRefundValidation,
  processRefundValidation

};