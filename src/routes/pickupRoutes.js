const express = require("express");

const router = express.Router();

const pickupController =
    require("../controllers/pickupController");

const {
    validateAssignPickup,
    validateShipmentId,
    validateMyPickups,
    validateCompletePickup
} = require("../validations/pickupValidation");

const authMiddleware =
    require("../middleware/authMiddleware");

const roleMiddleware =
    require("../middleware/roleMiddleware");


// ==========================================
// ADMIN
// Assign Pickup Agent
// ==========================================

router.post(

    "/assign",

    authMiddleware,

    roleMiddleware("ADMIN"),

    validateAssignPickup,

    pickupController.assignPickupAgent

);


// ==========================================
// PICKUP AGENT
// Get My Pickups
// ==========================================

router.post(

    "/my-pickups",

    authMiddleware,

    roleMiddleware("PICKUP_AGENT"),

    validateMyPickups,

    pickupController.getMyPickups

);


// ==========================================
// PICKUP AGENT
// Accept Pickup
// ==========================================

router.post(

    "/accept",

    authMiddleware,

    roleMiddleware("PICKUP_AGENT"),

    validateShipmentId,

    pickupController.acceptPickup

);

// ==========================================
// PICKUP AGENT
// Complete Pickup
// ==========================================

router.post(

    "/complete",

    authMiddleware,

    roleMiddleware("PICKUP_AGENT"),

    validateCompletePickup,

    pickupController.completePickup

);


module.exports = router;