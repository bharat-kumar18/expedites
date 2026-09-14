const express = require("express");

const router = express.Router();

const reportController =
  require("../controllers/reportController");

const {
  validateDashboard,
  validateShipmentReport,
  validatePaymentReport,
  validateCODReport,
  validateWalletReport,
  validateComplaintReport,
  validateHubReport,
  validateCustomerReport,
  validateRevenueReport
} = require("../validations/reportValidation");

const {
  verifyToken
} = require("../middleware/authMiddleware");

const roleMiddleware =
  require("../middleware/roleMiddleware");


// ==========================================
// Dashboard
// ==========================================

router.post(
  "/dashboard",
  verifyToken,
  roleMiddleware("ADMIN"),
  validateDashboard,
  reportController.getDashboardSummary
);


// ==========================================
// Shipment Report
// ==========================================

router.post(
  "/shipments",
  verifyToken,
  roleMiddleware("ADMIN"),
  validateShipmentReport,
  reportController.getShipmentReport
);


// ==========================================
// Payment Report
// ==========================================

router.post(
  "/payments",
  verifyToken,
  roleMiddleware("ADMIN"),
  validatePaymentReport,
  reportController.getPaymentReport
);


// ==========================================
// COD Report
// ==========================================

router.post(
  "/cod",
  verifyToken,
  roleMiddleware("ADMIN"),
  validateCODReport,
  reportController.getCODReport
);


// ==========================================
// Wallet Report
// ==========================================

router.post(
  "/wallet",
  verifyToken,
  roleMiddleware("ADMIN"),
  validateWalletReport,
  reportController.getWalletReport
);


// ==========================================
// Complaint Report
// ==========================================

router.post(
  "/complaints",
  verifyToken,
  roleMiddleware("ADMIN"),
  validateComplaintReport,
  reportController.getComplaintReport
);


// ==========================================
// Hub Report
// ==========================================

router.post(
  "/hubs",
  verifyToken,
  roleMiddleware("ADMIN"),
  validateHubReport,
  reportController.getHubReport
);


// ==========================================
// Customer Report
// ==========================================

router.post(
  "/customers",
  verifyToken,
  roleMiddleware("ADMIN"),
  validateCustomerReport,
  reportController.getCustomerReport
);


// ==========================================
// Revenue Report
// ==========================================

router.post(
  "/revenue",
  verifyToken,
  roleMiddleware("ADMIN"),
  validateRevenueReport,
  reportController.getRevenueReport
);


module.exports = router;