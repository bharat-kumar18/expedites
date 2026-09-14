const {
  body,
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

      message:
        "Validation failed",

      errors:
        errors.array()

    });

  }


  next();

};


// ==========================================
// Create Complaint
// ==========================================

const validateCreateComplaint = [

  body("shipment_id")
    .isUUID()
    .withMessage(
      "Valid shipment_id is required"
    ),

  body("category")
    .isIn([
      "PARCEL_DELAY",
      "PARCEL_DAMAGED",
      "PARCEL_LOST",
      "WRONG_DELIVERY",
      "DELIVERY_FAILED",
      "PAYMENT_ISSUE",
      "COD_ISSUE",
      "PICKUP_ISSUE",
      "TRACKING_ISSUE",
      "OTHER"
    ])
    .withMessage(
      "Invalid complaint category"
    ),

  body("priority")
    .optional()
    .isIn([
      "LOW",
      "MEDIUM",
      "HIGH",
      "URGENT"
    ])
    .withMessage(
      "Invalid complaint priority"
    ),

  body("subject")
    .trim()
    .notEmpty()
    .withMessage(
      "Complaint subject is required"
    )
    .isLength({
      max: 150
    })
    .withMessage(
      "Subject cannot exceed 150 characters"
    ),

  body("description")
    .trim()
    .notEmpty()
    .withMessage(
      "Complaint description is required"
    ),

  validate

];


// ==========================================
// Update Complaint
// ==========================================

const validateUpdateComplaint = [

  body("complaint_id")
    .isUUID()
    .withMessage(
      "Valid complaint_id is required"
    ),

  body("category")
    .optional()
    .isIn([
      "PARCEL_DELAY",
      "PARCEL_DAMAGED",
      "PARCEL_LOST",
      "WRONG_DELIVERY",
      "DELIVERY_FAILED",
      "PAYMENT_ISSUE",
      "COD_ISSUE",
      "PICKUP_ISSUE",
      "TRACKING_ISSUE",
      "OTHER"
    ])
    .withMessage(
      "Invalid complaint category"
    ),

  body("priority")
    .optional()
    .isIn([
      "LOW",
      "MEDIUM",
      "HIGH",
      "URGENT"
    ])
    .withMessage(
      "Invalid complaint priority"
    ),

  body("subject")
    .optional()
    .trim()
    .isLength({
      max: 150
    })
    .withMessage(
      "Subject cannot exceed 150 characters"
    ),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(
      "Description cannot be empty"
    ),

  validate

];


// ==========================================
// Get Complaint
// ==========================================

const validateGetComplaint = [

  body("complaint_id")
    .isUUID()
    .withMessage(
      "Valid complaint_id is required"
    ),

  validate

];


// ==========================================
// Assign Complaint
// ==========================================

const validateAssignComplaint = [

  body("complaint_id")
    .isUUID()
    .withMessage(
      "Valid complaint_id is required"
    ),

  body("admin_id")
    .isUUID()
    .withMessage(
      "Valid admin_id is required"
    ),

  validate

];


// ==========================================
// Update Status
// ==========================================

const validateComplaintStatus = [

  body("complaint_id")
    .isUUID()
    .withMessage(
      "Valid complaint_id is required"
    ),

  body("status")
    .isIn([
      "OPEN",
      "ASSIGNED",
      "IN_PROGRESS",
      "RESOLVED",
      "CLOSED",
      "REJECTED"
    ])
    .withMessage(
      "Invalid complaint status"
    ),

  body("remark")
    .optional()
    .trim(),

  validate

];


// ==========================================
// Get History
// ==========================================

const validateComplaintHistory = [

  body("complaint_id")
    .isUUID()
    .withMessage(
      "Valid complaint_id is required"
    ),

  validate

];


// ==========================================
// Get All Complaints
// ==========================================

const validateGetAllComplaints = [

  body("page")
    .optional()
    .isInt({
      min: 1
    })
    .withMessage(
      "page must be greater than 0"
    ),

  body("limit")
    .optional()
    .isInt({
      min: 1,
      max: 100
    })
    .withMessage(
      "limit must be between 1 and 100"
    ),

  body("status")
    .optional()
    .isIn([
      "OPEN",
      "ASSIGNED",
      "IN_PROGRESS",
      "RESOLVED",
      "CLOSED",
      "REJECTED"
    ])
    .withMessage(
      "Invalid complaint status"
    ),

  body("priority")
    .optional()
    .isIn([
      "LOW",
      "MEDIUM",
      "HIGH",
      "URGENT"
    ])
    .withMessage(
      "Invalid complaint priority"
    ),

  body("category")
    .optional()
    .isIn([
      "PARCEL_DELAY",
      "PARCEL_DAMAGED",
      "PARCEL_LOST",
      "WRONG_DELIVERY",
      "DELIVERY_FAILED",
      "PAYMENT_ISSUE",
      "COD_ISSUE",
      "PICKUP_ISSUE",
      "TRACKING_ISSUE",
      "OTHER"
    ])
    .withMessage(
      "Invalid complaint category"
    ),

  body("search")
    .optional()
    .trim()
    .isLength({
      max: 100
    })
    .withMessage(
      "Search cannot exceed 100 characters"
    ),

  validate

];


module.exports = {

  validateCreateComplaint,
  validateUpdateComplaint,
  validateGetComplaint,
  validateAssignComplaint,
  validateComplaintStatus,
  validateComplaintHistory,
  validateGetAllComplaints

};