const express = require("express");

const {
    createCity,
    getCities,
    getCity,
    searchCity,
    filterCity,
    updateCity,
    updateCityStatus
} = require("../controllers/cityController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// ========================================
// ADMIN AUTHORIZATION
// ========================================

router.use(
    authMiddleware,
    roleMiddleware("ADMIN")
);


// ========================================
// GET ALL CITIES
// ========================================

router.get(
    "/",
    getCities
);


// ========================================
// CREATE CITY
// ========================================

router.post(
    "/create",
    createCity
);


// ========================================
// GET ONE CITY
// ID IN BODY
// ========================================

router.post(
    "/get-one",
    getCity
);


// ========================================
// SEARCH CITY
// NAME IN BODY
// ========================================

router.post(
    "/search",
    searchCity
);


// ========================================
// FILTER CITY
// STATUS IN BODY
// ========================================

router.post(
    "/filter",
    filterCity
);


// ========================================
// UPDATE CITY
// ID IN BODY
// ========================================

router.put(
    "/update",
    updateCity
);


// ========================================
// UPDATE CITY STATUS
// ID + STATUS IN BODY
// ========================================

router.patch(
    "/status",
    updateCityStatus
);


module.exports = router;