const pincodeModel = require("../models/pincodeModel");
const { pool } = require("../config/db");


// ========================================
// CHECK HUB EXISTS
// ========================================

const checkHubExists = async (hub_id) => {

    const query = `
        SELECT
            h.id,
            h.name,
            h.city_id,
            h.status
        FROM hubs h
        WHERE h.id = $1
    `;

    const result = await pool.query(
        query,
        [hub_id]
    );

    return result.rows[0];
};


// ========================================
// CREATE PINCODE
// ========================================

const createPincode = async (data) => {

    const {
        hub_id,
        pincode
    } = data;


    // Check Hub
    const hub = await checkHubExists(hub_id);

    if (!hub) {

        throw new Error(
            "Selected hub does not exist"
        );

    }


    // Check Hub Status
    if (hub.status === "INACTIVE") {

        throw new Error(
            "Cannot add pincode to an inactive hub"
        );

    }


    // Check duplicate pincode
    const existing = await pincodeModel
        .getPincodeByNumber(pincode);


    if (existing.length > 0) {

        throw new Error(
            "This pincode already exists"
        );

    }


    return await pincodeModel
        .createPincode(data);
};


// ========================================
// GET ALL
// ========================================

const getAllPincodes = async () => {

    return await pincodeModel
        .getAllPincodes();
};


// ========================================
// GET BY ID
// ========================================

const getPincodeById = async (id) => {

    const pincode = await pincodeModel
        .getPincodeById(id);


    if (!pincode) {

        throw new Error(
            "Pincode not found"
        );

    }


    return pincode;
};


// ========================================
// SEARCH
// ========================================

const searchPincode = async (pincode) => {

    return await pincodeModel
        .getPincodeByNumber(pincode);
};


// ========================================
// GET BY HUB
// ========================================

const getPincodesByHub = async (hub_id) => {

    const hub = await checkHubExists(hub_id);


    if (!hub) {

        throw new Error(
            "Hub not found"
        );

    }


    return await pincodeModel
        .getPincodesByHub(hub_id);
};


// ========================================
// FILTER STATUS
// ========================================

const filterByStatus = async (status) => {

    return await pincodeModel
        .getPincodesByStatus(status);
};


// ========================================
// UPDATE
// ========================================

const updatePincode = async (id, data) => {

    const existing = await pincodeModel
        .getPincodeById(id);


    if (!existing) {

        throw new Error(
            "Pincode not found"
        );

    }


    // If hub is being changed
    if (data.hub_id) {

        const hub = await checkHubExists(
            data.hub_id
        );


        if (!hub) {

            throw new Error(
                "Selected hub does not exist"
            );

        }


        if (hub.status === "INACTIVE") {

            throw new Error(
                "Cannot assign pincode to an inactive hub"
            );

        }

    }


    // Check duplicate pincode
    if (
        data.pincode &&
        data.pincode !== existing.pincode
    ) {

        const duplicate =
            await pincodeModel
                .getPincodeByNumber(data.pincode);


        if (duplicate.length > 0) {

            throw new Error(
                "This pincode already exists"
            );

        }

    }


    return await pincodeModel
        .updatePincode(id, data);
};


// ========================================
// UPDATE STATUS
// ========================================

const updatePincodeStatus = async (
    id,
    status
) => {

    const existing = await pincodeModel
        .getPincodeById(id);


    if (!existing) {

        throw new Error(
            "Pincode not found"
        );

    }


    return await pincodeModel
        .updatePincodeStatus(
            id,
            status
        );
};


module.exports = {
    createPincode,
    getAllPincodes,
    getPincodeById,
    searchPincode,
    getPincodesByHub,
    filterByStatus,
    updatePincode,
    updatePincodeStatus
};