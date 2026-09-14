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
// Calculate Validation
// ==========================================

const calculateShipmentCostValidation = [

  body("shipment_id")
    .isUUID()
    .withMessage(
      "Valid shipment_id is required"
    ),

  body("distance_km")
    .isFloat({ min: 0 })
    .withMessage(
      "distance_km must be a valid number"
    ),

  body("fuel_cost")
    .isFloat({ min: 0 })
    .withMessage(
      "fuel_cost must be a valid number"
    ),

  body("labour_cost")
    .isFloat({ min: 0 })
    .withMessage(
      "labour_cost must be a valid number"
    ),

  body("shipping_revenue")
    .optional()
    .isFloat({ min: 0 })
    .withMessage(
      "shipping_revenue must be a valid number"
    ),

  validate

];


// ==========================================
// Update Validation
// ==========================================

const updateShipmentCostValidation = [

  body("shipment_id")
    .isUUID()
    .withMessage(
      "Valid shipment_id is required"
    ),

  body("distance_km")
    .isFloat({ min: 0 })
    .withMessage(
      "distance_km must be a valid number"
    ),

  body("fuel_cost")
    .isFloat({ min: 0 })
    .withMessage(
      "fuel_cost must be a valid number"
    ),

  body("labour_cost")
    .isFloat({ min: 0 })
    .withMessage(
      "labour_cost must be a valid number"
    ),

  body("shipping_revenue")
    .optional()
    .isFloat({ min: 0 })
    .withMessage(
      "shipping_revenue must be a valid number"
    ),

  validate

];


// ==========================================
// Get Validation
// ==========================================

const getShipmentCostValidation = [

  body("shipment_id")
    .isUUID()
    .withMessage(
      "Valid shipment_id is required"
    ),

  validate

];


// ==========================================
// Get All Validation
// ==========================================

const getAllShipmentCostsValidation = [

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage(
      "page must be greater than 0"
    ),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage(
      "limit must be between 1 and 100"
    ),

  validate

];


// ==========================================
// Export
// ==========================================

module.exports = {

  calculateShipmentCostValidation,

  updateShipmentCostValidation,

  getShipmentCostValidation,

  getAllShipmentCostsValidation

};