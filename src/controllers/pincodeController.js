const pincodeService = require("../services/pincodeService");


// ========================================
// CREATE PINCODE
// ========================================

const createPincode = async (req, res) => {

    try {

        const pincode = await pincodeService
            .createPincode(req.body);


        return res.status(201).json({

            success: true,

            message: "Pincode created successfully",

            data: pincode

        });

    } catch (error) {

        console.error(
            "Create Pincode Error:",
            error.message
        );


        return res.status(400).json({

            success: false,

            message: error.message

        });

    }
};


// ========================================
// GET ALL PINCODES
// ========================================

const getAllPincodes = async (req, res) => {

    try {

        const pincodes =
            await pincodeService
                .getAllPincodes();


        return res.status(200).json({

            success: true,

            count: pincodes.length,

            data: pincodes

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }
};


// ========================================
// GET PINCODE BY ID
// BODY ONLY
// ========================================

const getPincode = async (req, res) => {

    try {

        const { id } = req.body;


        const pincode =
            await pincodeService
                .getPincodeById(id);


        return res.status(200).json({

            success: true,

            data: pincode

        });

    } catch (error) {

        return res.status(404).json({

            success: false,

            message: error.message

        });

    }
};


// ========================================
// SEARCH PINCODE
// ========================================

const searchPincode = async (req, res) => {

    try {

        const { pincode } = req.body;


        const result =
            await pincodeService
                .searchPincode(pincode);


        return res.status(200).json({

            success: true,

            count: result.length,

            data: result

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }
};


// ========================================
// GET PINCODES BY HUB
// ========================================

const getPincodesByHub = async (req, res) => {

    try {

        const { hub_id } = req.body;


        const result =
            await pincodeService
                .getPincodesByHub(hub_id);


        return res.status(200).json({

            success: true,

            count: result.length,

            data: result

        });

    } catch (error) {

        return res.status(404).json({

            success: false,

            message: error.message

        });

    }
};


// ========================================
// FILTER BY STATUS
// ========================================

const filterPincodes = async (req, res) => {

    try {

        const { status } = req.body;


        const result =
            await pincodeService
                .filterByStatus(status);


        return res.status(200).json({

            success: true,

            count: result.length,

            data: result

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }
};


// ========================================
// UPDATE PINCODE
// ========================================

const updatePincode = async (req, res) => {

    try {

        const {
            id,
            hub_id,
            pincode,
            area,
            status
        } = req.body;


        const updated =
            await pincodeService
                .updatePincode(
                    id,
                    {
                        hub_id,
                        pincode,
                        area,
                        status
                    }
                );


        return res.status(200).json({

            success: true,

            message: "Pincode updated successfully",

            data: updated

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }
};


// ========================================
// UPDATE STATUS
// ========================================

const updatePincodeStatus = async (req, res) => {

    try {

        const {
            id,
            status
        } = req.body;


        const updated =
            await pincodeService
                .updatePincodeStatus(
                    id,
                    status
                );


        return res.status(200).json({

            success: true,

            message: "Pincode status updated successfully",

            data: updated

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }
};


module.exports = {
    createPincode,
    getAllPincodes,
    getPincode,
    searchPincode,
    getPincodesByHub,
    filterPincodes,
    updatePincode,
    updatePincodeStatus
};