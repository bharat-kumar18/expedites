const express = require("express");

const router =
  express.Router();

const shipmentPaymentController =
  require("../controllers/shipmentPaymentController");

const {
  verifyToken
} = require("../middleware/authMiddleware");

const {
  createShipmentPaymentValidation,
  payShipmentValidation,
  failShipmentPaymentValidation,
  getShipmentPaymentValidation,
  getAllShipmentPaymentsValidation
} =
  require("../validations/shipmentPaymentValidation");


// ==========================================
// Create Shipment Payment
// ==========================================

router.post(
  "/create",
  verifyToken,
  createShipmentPaymentValidation,
  shipmentPaymentController.createShipmentPayment
);


// ==========================================
// Pay From Wallet
// ==========================================

router.post(
  "/pay",
  verifyToken,
  payShipmentValidation,
  shipmentPaymentController.payShipmentFromWallet
);


// ==========================================
// Fail Payment
// ==========================================

router.post(
  "/fail",
  verifyToken,
  failShipmentPaymentValidation,
  shipmentPaymentController.failShipmentPayment
);


// ==========================================
// Get Payment
// ==========================================

router.post(
  "/get",
  verifyToken,
  getShipmentPaymentValidation,
  shipmentPaymentController.getShipmentPayment
);


// ==========================================
// Get All
// ==========================================

router.get(
  "/all",
  verifyToken,
  getAllShipmentPaymentsValidation,
  shipmentPaymentController.getAllShipmentPayments
);


module.exports = router;