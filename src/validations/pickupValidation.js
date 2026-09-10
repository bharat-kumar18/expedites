// ==========================================
// Validate Pickup Assignment
// ==========================================

const validateAssignPickup = (req, res, next) => {

    const {
        shipment_id,
        pickup_agent_id
    } = req.body || {};


    // ==========================================
    // Required Fields
    // ==========================================

    if (!shipment_id || !pickup_agent_id) {

        return res.status(400).json({

            success: false,

            message:
                "shipment_id and pickup_agent_id are required"

        });

    }


    next();

};


// ==========================================
// Validate Shipment ID
// ==========================================

const validateShipmentId = (req, res, next) => {

    const {
        shipment_id
    } = req.body || {};


    if (!shipment_id) {

        return res.status(400).json({

            success: false,

            message: "shipment_id is required"

        });

    }


    next();

};


// ==========================================
// Validate My Pickups
// ==========================================

const validateMyPickups = (req, res, next) => {

    // req.body can be undefined
    const body = req.body || {};

    const {
        status
    } = body;


    // ==========================================
    // Status is optional
    // ==========================================

    if (!status) {

        return next();

    }


    // ==========================================
    // Allowed Pickup Status
    // ==========================================

    const allowedStatuses = [

        "ASSIGNED",
        "ACCEPTED",
        "PICKED_UP",
        "FAILED",
        "CANCELLED"

    ];


    if (!allowedStatuses.includes(status)) {

        return res.status(400).json({

            success: false,

            message:
                "Invalid pickup status. Allowed values: ASSIGNED, ACCEPTED, PICKED_UP, FAILED, CANCELLED"

        });

    }


    next();

};

// ==========================================
// Validate Complete Pickup
// ==========================================

const validateCompletePickup = (req, res, next) => {

    const {
        shipment_id
    } = req.body || {};


    if (!shipment_id) {

        return res.status(400).json({

            success: false,

            message: "shipment_id is required"

        });

    }


    next();

};


// ==========================================
// Export
// ==========================================

module.exports = {
    validateAssignPickup,
    validateShipmentId,
    validateMyPickups,
    validateCompletePickup
};