const express = require("express");

const router =
  express.Router();

const refundController =
  require("../controllers/refundController");

const {
  verifyToken
} = require("../middleware/authMiddleware");

const {
  createRefundValidation,
  processRefundValidation
} = require("../validations/refundValidation");


// ==========================================
// Create Refund
// ==========================================

router.post(
  "/create",
  verifyToken,
  refundController.createRefund
);


// ==========================================
// Process Wallet Refund
// ==========================================

router.post(
  "/process",
  verifyToken,
  refundController.processWalletRefund
);


// ==========================================
// My Refunds
// ==========================================

router.get(
  "/",
  verifyToken,
  refundController.getCustomerRefunds
);


// ==========================================
// Admin Refunds
// ==========================================

router.get(
  "/admin/all",
  verifyToken,
  refundController.getAllRefunds
);
// ==========================================
// Customer Refund Report
router.post(
  "/create",
  verifyToken,
  createRefundValidation,
  refundController.createRefund
);
// =========================================
// Process Wallet Refund 

router.post(
  "/process",
  verifyToken,
  processRefundValidation,
  refundController.processWalletRefund
);


module.exports = router;