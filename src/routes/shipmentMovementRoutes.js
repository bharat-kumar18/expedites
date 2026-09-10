const express = require("express");

const router = express.Router();


const shipmentMovementController =
  require("../controllers/shipmentMovementController");


const {
  validateCreateMovement,
  validateShipmentMovement
} =
  require("../validations/shipmentMovementValidation");


const authMiddleware = require("../middleware/authMiddleware");


const roleMiddleware = require("../middleware/roleMiddleware");


// ==========================================
// ADMIN
// Move Shipment To Hub
// ==========================================

router.post("/move",authMiddleware,roleMiddleware("ADMIN"),validateCreateMovement,shipmentMovementController.createMovement);


// ==========================================
// ADMIN / CUSTOMER
// Get Shipment Movement History
// ==========================================

router.post( "/history", authMiddleware, roleMiddleware("ADMIN","CUSTOMER"), validateShipmentMovement, shipmentMovementController.getShipmentMovements );


module.exports = router;