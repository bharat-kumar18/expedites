const express = require("express");

const router = express.Router();

const shipmentCostController =
  require("../controllers/shipmentCostController");

const {
  calculateShipmentCostValidation,
  updateShipmentCostValidation,
  getShipmentCostValidation,
  getAllShipmentCostsValidation
} = require("../validations/shipmentCostValidation");

// Use your existing auth middleware here
const {verifyToken} =
  require("../middleware/authMiddleware");


// ==========================================
// Calculate Shipment Cost
// ==========================================

router.post(
  "/calculate",
  verifyToken,
  calculateShipmentCostValidation,
  shipmentCostController.calculateShipmentCost
);


// ==========================================
// Update Shipment Cost
// ==========================================

router.put(
  "/update",
  verifyToken,
  updateShipmentCostValidation,
  shipmentCostController.updateShipmentCost
);


// ==========================================
// Get Shipment Cost
// ==========================================

router.post(
  "/get",
  verifyToken,
  getShipmentCostValidation,
  shipmentCostController.getShipmentCost
);


// ==========================================
// Get All Shipment Costs
// ==========================================

router.get(
  "/all",
  verifyToken,
  getAllShipmentCostsValidation,
  shipmentCostController.getAllShipmentCosts
);


// ==========================================
// Export
// ==========================================

module.exports = router;