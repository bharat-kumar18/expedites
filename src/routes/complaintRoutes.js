const express =
  require("express");

const router =
  express.Router();


const complaintController =
  require("../controllers/complaintController");


const {

  validateCreateComplaint,

  validateUpdateComplaint,

  validateGetComplaint,

  validateAssignComplaint,

  validateComplaintStatus,

  validateComplaintHistory,

  validateGetAllComplaints

} =
  require("../validations/complaintValidation");


const {
  verifyToken
} =
  require("../middleware/authMiddleware");


// ==========================================
// Create Complaint
// ==========================================

router.post(
  "/create",
  verifyToken,
  validateCreateComplaint,
  complaintController.createComplaint
);


// ==========================================
// Update Complaint
// ==========================================

router.put(
  "/update",
  verifyToken,
  validateUpdateComplaint,
  complaintController.updateComplaint
);


// ==========================================
// Assign Complaint
// ==========================================

router.post(
  "/assign",
  verifyToken,
  validateAssignComplaint,
  complaintController.assignComplaint
);


// ==========================================
// Update Complaint Status
// ==========================================

router.post(
  "/status",
  verifyToken,
  validateComplaintStatus,
  complaintController.updateComplaintStatus
);


// ==========================================
// Get Complaint
// ==========================================

router.post(
  "/get",
  verifyToken,
  validateGetComplaint,
  complaintController.getComplaint
);


// ==========================================
// Complaint History
// ==========================================

router.post(
  "/history",
  verifyToken,
  validateComplaintHistory,
  complaintController.getComplaintHistory
);


// ==========================================
// Get All Complaints
// ==========================================

router.post(
  "/all",
  verifyToken,
  validateGetAllComplaints,
  complaintController.getAllComplaints
);


module.exports = router;