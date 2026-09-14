const express = require("express");

const router =
  express.Router();

  const {
  validateCreateCOD,
  validateCollectCOD,
  validateCODSettlement
} = require("../validations/codValidation");

const codController =
  require("../controllers/codController");

const {
  verifyToken
} = require("../middleware/authMiddleware");


// ==========================================
// Create COD
// ==========================================

router.post( "/create", verifyToken, codController.createCOD);

// ==========================================
// Collect COD
// ==========================================

router.post( "/collect", verifyToken, codController.collectCOD);

// ==========================================
// Reconcile COD
// ==========================================

router.post( "/reconcile", verifyToken, codController.reconcileCOD);
// ==========================================
// Settle COD
// ==========================================

router.post( "/settle", verifyToken, validateCODSettlement, codController.settleCOD);
// ==========================================
// Get COD
// ==========================================

router.post( "/get", verifyToken, codController.getCOD);


module.exports = router;