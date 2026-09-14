const {
  body,
  query,
  validationResult
} = require("express-validator");


// ==========================================
// Validation Result
// ==========================================

const validate = (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {

    return res.status(400).json({

      success: false,

      message: "Validation failed",

      errors: errors.array()

    });

  }

  next();

};


// ==========================================
// Wallet Recharge Validation
// ==========================================

const validateRecharge = (
  data
) => {

  const {
    amount,
    payment_method
  } = data;


  if (
    amount === undefined ||
    amount === null ||
    Number(amount) <= 0
  ) {

    throw new Error(
      "Valid recharge amount is required"
    );

  }


  const allowedMethods = [
    "UPI",
    "CARD",
    "NET_BANKING",
    "WALLET"
  ];


  if (
    !allowedMethods.includes(
      payment_method
    )
  ) {

    throw new Error(
      "Invalid payment method"
    );

  }

};


// ==========================================
// Get All Payments Validation
// ==========================================

const getAllPaymentsValidation = [

  body("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage(
      "page must be greater than 0"
    ),

  body("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage(
      "limit must be between 1 and 100"
    ),

  body("status")
    .optional()
    .isIn([
      "PENDING",
      "SUCCESS",
      "FAILED",
      "REFUNDED"
    ])
    .withMessage(
      "Invalid payment status"
    ),

  body("payment_type")
    .optional()
    .isIn([
      "WALLET_RECHARGE",
      "SHIPMENT_PAYMENT",
      "REFUND"
    ])
    .withMessage(
      "Invalid payment type"
    ),

  body("payment_method")
    .optional()
    .isIn([
      "UPI",
      "CARD",
      "NET_BANKING",
      "WALLET",
      "COD"
    ])
    .withMessage(
      "Invalid payment method"
    ),

  body("search")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage(
      "Search cannot exceed 100 characters"
    ),

  validate

];


// ==========================================
// Export
// ==========================================

module.exports = {
  validateRecharge,
  getAllPaymentsValidation
};