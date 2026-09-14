const express = require("express");

const {
    createPincode,
    getAllPincodes,
    getPincode,
    searchPincode,
    getPincodesByHub,
    filterPincodes,
    updatePincode,
    updatePincodeStatus
} = require("../controllers/pincodeController");

const {authMiddleware} = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    validateCreatePincode,
    validateGetPincode,
    validateSearchPincode,
    validateHubPincode,
    validatePincodeStatus
} = require("../validations/pincodeValidation");


const router = express.Router();


// ========================================
// ADMIN AUTHORIZATION
// ========================================

router.use(
    authMiddleware,
    roleMiddleware("ADMIN")
);


// ========================================
// GET ALL
// GET /api/pincodes
// ========================================

router.get("/",getAllPincodes);


// ========================================
// CREATE
// POST /api/pincodes/create
// ========================================

router.post("/create",validateCreatePincode,createPincode);


// ========================================
// GET ONE
// POST /api/pincodes/get-one
// ========================================

router.post("/get-one",validateGetPincode,getPincode);


// ========================================
// SEARCH
// POST /api/pincodes/search
// ========================================

router.post("/search",validateSearchPincode,searchPincode);


// ========================================
// BY HUB
// POST /api/pincodes/by-hub
// ========================================

router.post("/by-hub",validateHubPincode,getPincodesByHub);


// ========================================
// FILTER
// POST /api/pincodes/filter
// ========================================

router.post("/filter",filterPincodes);


// ========================================
// UPDATE
// PUT /api/pincodes/update
// ========================================

router.put("/update",validateGetPincode,updatePincode);


// ========================================
// STATUS
// PATCH /api/pincodes/status
// ========================================

router.patch("/status",validatePincodeStatus,updatePincodeStatus);


module.exports = router;