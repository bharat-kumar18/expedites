const express = require("express");

const router = express.Router();


const trackingController =
  require("../controllers/trackingController");


const {
  validateTracking
} = require("../validations/trackingValidation");


const {authMiddleware} = require("../middleware/authMiddleware");


const roleMiddleware = require("../middleware/roleMiddleware");


// ==========================================
// Track Shipment
// ==========================================
// CUSTOMER + ADMIN + SUPER_ADMIN
// ==========================================

router.post(

  "/track",

  authMiddleware,

  roleMiddleware(
    "CUSTOMER",
    "ADMIN",
    "SUPER_ADMIN"
  ),

  validateTracking,

  trackingController.trackShipment

);


module.exports = router;