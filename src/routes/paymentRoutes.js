const express = require("express");

const router =
  express.Router();

const paymentController =
  require("../controllers/paymentController");

const {
  verifyToken
} = require("../middleware/authMiddleware");

const {
  getAllPaymentsValidation
} = require("../validations/paymentValidation");


// ==========================================
// Wallet Recharge
// ==========================================

router.post(
  "/recharge",
  verifyToken,
  paymentController.createRecharge
);


// ==========================================
// Complete Payment
// ==========================================

router.post(
  "/complete",
  verifyToken,
  paymentController.completeRecharge
);


// ==========================================
// Payment History
// ==========================================

router.get(
  "/",
  verifyToken,
  paymentController.getPayments
);

// ==========================================
// get all payments for admin
// ==========================================

router.get(
  "/all",
  verifyToken,
  getAllPaymentsValidation,
  paymentController.getAllPayments
);

// ==========================================
// get payments report
// ==========================================

router.get(
  "/admin/report",
  verifyToken,
  paymentController.getPaymentReport
);


module.exports = router;