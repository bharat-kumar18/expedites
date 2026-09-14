const {
  body,
  query,
  validationResult
} = require("express-validator");


// ==========================================
// Validation Result
// ==========================================

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


// ==========================================
// Create Payment
// ==========================================

const createShipmentPaymentValidation = [

  body("shipment_id")
    .isUUID()
    .withMessage(
      "Valid shipment_id is required"
    ),

  body("payment_method")
    .equals("WALLET")
    .withMessage(
      "Currently only WALLET payment is supported"
    ),

  validate

];


// ==========================================
// Pay Payment
// ==========================================

const payShipmentValidation = [

  body("payment_id")
    .isUUID()
    .withMessage(
      "Valid payment_id is required"
    ),

  validate

];


// ==========================================
// Fail Payment
// ==========================================

const failShipmentPaymentValidation = [

  body("payment_id")
    .isUUID()
    .withMessage(
      "Valid payment_id is required"
    ),

  body("reason")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage(
      "Reason must be a valid string"
    ),

  validate

];


// ==========================================
// Get Payment
// ==========================================

const getShipmentPaymentValidation = [

  body("shipment_id")
    .isUUID()
    .withMessage(
      "Valid shipment_id is required"
    ),

  validate

];


// ==========================================
// Get All
// ==========================================

const getAllShipmentPaymentsValidation = [

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage(
      "page must be greater than 0"
    ),

  query("limit")
    .optional()
    .isInt({
      min: 1,
      max: 100
    })
    .withMessage(
      "limit must be between 1 and 100"
    ),

  validate

];


module.exports = {

  createShipmentPaymentValidation,
  payShipmentValidation,
  failShipmentPaymentValidation,
  getShipmentPaymentValidation,
  getAllShipmentPaymentsValidation

};