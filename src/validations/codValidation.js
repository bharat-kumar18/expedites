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
// Create COD Validation
// ==========================================

const validateCreateCOD = (
  data
) => {

  if (
    !data.shipment_id
  ) {

    throw new Error(
      "shipment_id is required"
    );

  }


  if (
    !data.cod_amount ||
    Number(data.cod_amount) <= 0
  ) {

    throw new Error(
      "Valid COD amount is required"
    );

  }


  if (
    data.company_fee !== undefined &&
    Number(data.company_fee) < 0
  ) {

    throw new Error(
      "Company fee cannot be negative"
    );

  }

};


// ==========================================
// Collect COD Validation
// ==========================================

const validateCollectCOD = (
  data
) => {

  if (!data.shipment_id) {

    throw new Error(
      "shipment_id is required"
    );

  }


  if (
    !["CASH", "UPI"]
      .includes(
        data.collection_method
      )
  ) {

    throw new Error(
      "Collection method must be CASH or UPI"
    );

  }

};


// ==========================================
// COD Settlement Validation
// ==========================================

const validateCODSettlement = [

  body("shipment_id")
    .isUUID()
    .withMessage(
      "Valid shipment_id is required"
    ),

  body("settlement_amount")
    .isFloat({ min: 0.01 })
    .withMessage(
      "Valid settlement_amount is required"
    ),

  body("settlement_method")
    .isIn([
      "BANK_TRANSFER",
      "UPI",
      "WALLET"
    ])
    .withMessage(
      "Invalid settlement method"
    ),

  body("transaction_reference")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage(
      "Transaction reference cannot exceed 100 characters"
    ),

  body("remark")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage(
      "Remark cannot exceed 500 characters"
    ),

  validate

];


// ==========================================
// Export
// ==========================================

module.exports = {

  validateCreateCOD,

  validateCollectCOD,

  validateCODSettlement

};