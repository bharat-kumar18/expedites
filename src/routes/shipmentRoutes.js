const express = require("express");

const router = express.Router();

const shipmentController =
  require("../controllers/shipmentController");

const {
  validateShipment
} = require("../validations/shipmentValidation");

const {authMiddleware} = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");


// ==========================================
// Create Shipment
// ==========================================

router.post("/create",authMiddleware,roleMiddleware("CUSTOMER"),validateShipment,shipmentController.createShipment);


module.exports = router;