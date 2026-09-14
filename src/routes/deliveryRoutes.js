const express = require("express");

const router =
  express.Router();


const deliveryController =
  require("../controllers/deliveryController");


const {
  validateAssignDelivery,
  validateShipmentId,
  validateMyDeliveries,
  validateCompleteDelivery,
  validateFailedDelivery
} =
  require("../validations/deliveryValidation");


const {authMiddleware} =
  require("../middleware/authMiddleware");


const roleMiddleware =
  require("../middleware/roleMiddleware");


// ==========================================
// ADMIN
// Assign Delivery Agent
// ==========================================

router.post(

  "/assign",

  authMiddleware,

  roleMiddleware("ADMIN"),

  validateAssignDelivery,

  deliveryController.assignDeliveryAgent

);


// ==========================================
// DELIVERY AGENT
// Get My Deliveries
// ==========================================

router.post(

  "/my-deliveries",

  authMiddleware,

  roleMiddleware("DELIVERY_AGENT"),

  validateMyDeliveries,

  deliveryController.getMyDeliveries

);


// ==========================================
// DELIVERY AGENT
// Accept Delivery
// ==========================================

router.post(

  "/accept",

  authMiddleware,

  roleMiddleware("DELIVERY_AGENT"),

  validateShipmentId,

  deliveryController.acceptDelivery

);


// ==========================================
// DELIVERY AGENT
// Start Delivery
// ==========================================

router.post(

  "/start",

  authMiddleware,

  roleMiddleware("DELIVERY_AGENT"),

  validateShipmentId,

  deliveryController.startDelivery

);


// ==========================================
// DELIVERY AGENT
// Complete Delivery
// ==========================================

router.post(

  "/complete",

  authMiddleware,

  roleMiddleware("DELIVERY_AGENT"),

  validateCompleteDelivery,

  deliveryController.completeDelivery

);


// ==========================================
// DELIVERY AGENT
// Failed Delivery
// ==========================================

router.post(

  "/fail",

  authMiddleware,

  roleMiddleware("DELIVERY_AGENT"),

  validateFailedDelivery,

  deliveryController.failDelivery

);


// ==========================================
// ADMIN
// Get Delivery By Shipment
// ==========================================

router.post(

  "/by-shipment",

  authMiddleware,

  roleMiddleware("ADMIN"),

  validateShipmentId,

  deliveryController.getDeliveryByShipmentId

);


module.exports = router;