const { pool } = require("../config/db");


// ========================================
// CREATE PINCODE
// ========================================

const createPincode = async (pincodeData) => {

    const {
        hub_id,
        pincode,
        area,
        status
    } = pincodeData;

    const query = `
        INSERT INTO pincodes
        (
            hub_id,
            pincode,
            area,
            status
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;

    const values = [
        hub_id,
        pincode,
        area || null,
        status || "ACTIVE"
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};


// ========================================
// GET ALL PINCODES
// ========================================

const getAllPincodes = async () => {

    const query = `
        SELECT
            p.id,
            p.hub_id,
            p.pincode,
            p.area,
            p.status,
            p.created_at,
            p.updated_at,

            h.name AS hub_name,
            h.city_id,

            c.name AS city_name

        FROM pincodes p

        JOIN hubs h
            ON p.hub_id = h.id

        JOIN cities c
            ON h.city_id = c.id

        ORDER BY p.created_at DESC
    `;

    const result = await pool.query(query);

    return result.rows;
};


// ========================================
// GET PINCODE BY ID
// ID COMES FROM BODY
// ========================================

const getPincodeById = async (id) => {

    const query = `
        SELECT
            p.id,
            p.hub_id,
            p.pincode,
            p.area,
            p.status,
            p.created_at,
            p.updated_at,

            h.name AS hub_name,
            h.city_id,

            c.name AS city_name

        FROM pincodes p

        JOIN hubs h
            ON p.hub_id = h.id

        JOIN cities c
            ON h.city_id = c.id

        WHERE p.id = $1
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0];
};


// ========================================
// SEARCH BY PINCODE
// ========================================

const getPincodeByNumber = async (pincode) => {

    const query = `
        SELECT
            p.*,
            h.name AS hub_name,
            h.city_id,
            c.name AS city_name

        FROM pincodes p

        JOIN hubs h
            ON p.hub_id = h.id

        JOIN cities c
            ON h.city_id = c.id

        WHERE p.pincode = $1
    `;

    const result = await pool.query(query, [pincode]);

    return result.rows;
};


// ========================================
// GET PINCODES BY HUB
// ========================================

const getPincodesByHub = async (hub_id) => {

    const query = `
        SELECT
            p.*,
            h.name AS hub_name,
            h.city_id,
            c.name AS city_name

        FROM pincodes p

        JOIN hubs h
            ON p.hub_id = h.id

        JOIN cities c
            ON h.city_id = c.id

        WHERE p.hub_id = $1

        ORDER BY p.pincode ASC
    `;

    const result = await pool.query(query, [hub_id]);

    return result.rows;
};


// ========================================
// FILTER BY STATUS
// ========================================

const getPincodesByStatus = async (status) => {

    const query = `
        SELECT
            p.*,
            h.name AS hub_name,
            h.city_id,
            c.name AS city_name

        FROM pincodes p

        JOIN hubs h
            ON p.hub_id = h.id

        JOIN cities c
            ON h.city_id = c.id

        WHERE p.status = $1

        ORDER BY p.created_at DESC
    `;

    const result = await pool.query(query, [status]);

    return result.rows;
};


// ========================================
// UPDATE PINCODE
// ========================================

const updatePincode = async (id, pincodeData) => {

    const {
        hub_id,
        pincode,
        area,
        status
    } = pincodeData;

    const query = `
        UPDATE pincodes

        SET
            hub_id = COALESCE($1, hub_id),
            pincode = COALESCE($2, pincode),
            area = COALESCE($3, area),
            status = COALESCE($4, status),
            updated_at = CURRENT_TIMESTAMP

        WHERE id = $5

        RETURNING *
    `;

    const values = [
        hub_id || null,
        pincode || null,
        area || null,
        status || null,
        id
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};


// ========================================
// UPDATE STATUS
// ========================================

const updatePincodeStatus = async (id, status) => {

    const query = `
        UPDATE pincodes

        SET
            status = $1,
            updated_at = CURRENT_TIMESTAMP

        WHERE id = $2

        RETURNING *
    `;

    const result = await pool.query(
        query,
        [status, id]
    );

    return result.rows[0];
};


module.exports = {
    createPincode,
    getAllPincodes,
    getPincodeById,
    getPincodeByNumber,
    getPincodesByHub,
    getPincodesByStatus,
    updatePincode,
    updatePincodeStatus
};