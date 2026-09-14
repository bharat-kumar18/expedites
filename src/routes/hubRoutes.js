const express = require("express");

const {
    createHub,
    getHubs,
    getHub,
    getHubsByCity,
    searchHub,
    filterHub,
    updateHub,
    updateHubStatus
} = require("../controllers/hubController");

const {authMiddleware} = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// ========================================
// ADMIN ONLY
// ========================================

router.use(
    authMiddleware,
    roleMiddleware("ADMIN")
);


// ========================================
// GET ALL HUBS
// ========================================

router.get("/",getHubs);


// ========================================
// CREATE HUB
// ========================================

router.post("/create",createHub);


// ========================================
// GET ONE HUB
// ID IN BODY
// ========================================

router.post("/get-one",getHub);


// ========================================
// GET HUBS BY CITY
// city_id IN BODY
// ========================================

router.post("/by-city",getHubsByCity);


// ========================================
// SEARCH HUB
// name IN BODY
// ========================================

router.post("/search",searchHub);


// ========================================
// FILTER HUB
// status IN BODY
// ========================================

router.post("/filter",filterHub);


// ========================================
// UPDATE HUB
// id IN BODY
// ========================================

router.put("/update",updateHub);


// ========================================
// UPDATE HUB STATUS
// id + status IN BODY
// ========================================

router.patch("/status",updateHubStatus);


module.exports = router;