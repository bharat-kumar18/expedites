// ========================================
// CREATE PINCODE VALIDATION
// ========================================

const validateCreatePincode = (req, res, next) => {

    const {
        hub_id,
        pincode,
        area
    } = req.body;


    if (!hub_id) {

        return res.status(400).json({
            success: false,
            message: "hub_id is required"
        });

    }


    if (!pincode) {

        return res.status(400).json({
            success: false,
            message: "Pincode is required"
        });

    }


    if (!/^\d{6}$/.test(pincode)) {

        return res.status(400).json({
            success: false,
            message: "Pincode must contain exactly 6 digits"
        });

    }


    if (area && area.length > 150) {

        return res.status(400).json({
            success: false,
            message: "Area cannot exceed 150 characters"
        });

    }


    next();
};


// ========================================
// GET BY ID VALIDATION
// ========================================

const validateGetPincode = (req, res, next) => {

    const { id } = req.body;


    if (!id) {

        return res.status(400).json({
            success: false,
            message: "Pincode id is required"
        });

    }


    next();
};


// ========================================
// SEARCH VALIDATION
// ========================================

const validateSearchPincode = (req, res, next) => {

    const { pincode } = req.body;


    if (!pincode) {

        return res.status(400).json({
            success: false,
            message: "Pincode is required"
        });

    }


    if (!/^\d{6}$/.test(pincode)) {

        return res.status(400).json({
            success: false,
            message: "Invalid pincode"
        });

    }


    next();
};


// ========================================
// HUB FILTER VALIDATION
// ========================================

const validateHubPincode = (req, res, next) => {

    const { hub_id } = req.body;


    if (!hub_id) {

        return res.status(400).json({
            success: false,
            message: "hub_id is required"
        });

    }


    next();
};


// ========================================
// STATUS VALIDATION
// ========================================

const validatePincodeStatus = (req, res, next) => {

    const { id, status } = req.body;


    if (!id) {

        return res.status(400).json({
            success: false,
            message: "Pincode id is required"
        });

    }


    if (!status) {

        return res.status(400).json({
            success: false,
            message: "Status is required"
        });

    }


    if (!["ACTIVE", "INACTIVE"].includes(status)) {

        return res.status(400).json({
            success: false,
            message: "Status must be ACTIVE or INACTIVE"
        });

    }


    next();
};


module.exports = {
    validateCreatePincode,
    validateGetPincode,
    validateSearchPincode,
    validateHubPincode,
    validatePincodeStatus
};