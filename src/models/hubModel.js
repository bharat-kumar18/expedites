const { pool } = require("../config/db");


// ========================================
// CREATE HUB
// ========================================

const createHub = async ({
    name,
    hub_code,
    city_id,
    address,
    phone
}) => {

    const query = `
        INSERT INTO hubs (
            name,
            hub_code,
            city_id,
            address,
            phone
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
            id,
            name,
            hub_code,
            city_id,
            address,
            phone,
            status,
            created_at,
            updated_at
    `;

    const values = [
        name,
        hub_code,
        city_id,
        address,
        phone
    ];

    const result = await pool.query(
        query,
        values
    );

    return result.rows[0];
};


// ========================================
// GET ALL HUBS
// ========================================

const getAllHubs = async () => {

    const query = `
        SELECT
            h.id,
            h.name,
            h.hub_code,
            h.city_id,
            c.name AS city_name,
            c.state AS city_state,
            h.address,
            h.phone,
            h.status,
            h.created_at,
            h.updated_at
        FROM hubs h
        INNER JOIN cities c
            ON h.city_id = c.id
        ORDER BY h.created_at DESC
    `;

    const result = await pool.query(query);

    return result.rows;
};


// ========================================
// GET HUB BY ID
// ========================================

const getHubById = async (id) => {

    const query = `
        SELECT
            h.id,
            h.name,
            h.hub_code,
            h.city_id,
            c.name AS city_name,
            c.state AS city_state,
            h.address,
            h.phone,
            h.status,
            h.created_at,
            h.updated_at
        FROM hubs h
        INNER JOIN cities c
            ON h.city_id = c.id
        WHERE h.id = $1
        LIMIT 1
    `;

    const result = await pool.query(
        query,
        [id]
    );

    return result.rows[0];
};


// ========================================
// CHECK HUB CODE
// ========================================

const findHubByCode = async (hub_code) => {

    const query = `
        SELECT
            id,
            name,
            hub_code,
            city_id,
            status
        FROM hubs
        WHERE LOWER(hub_code) = LOWER($1)
        LIMIT 1
    `;

    const result = await pool.query(
        query,
        [hub_code]
    );

    return result.rows[0];
};


// ========================================
// CHECK HUB IN SAME CITY
// ========================================

const findHubByNameAndCity = async (
    name,
    city_id
) => {

    const query = `
        SELECT
            id,
            name,
            hub_code,
            city_id,
            status
        FROM hubs
        WHERE LOWER(name) = LOWER($1)
        AND city_id = $2
        LIMIT 1
    `;

    const result = await pool.query(
        query,
        [
            name,
            city_id
        ]
    );

    return result.rows[0];
};


// ========================================
// GET HUBS BY CITY
// ========================================

const getHubsByCity = async (city_id) => {

    const query = `
        SELECT
            h.id,
            h.name,
            h.hub_code,
            h.city_id,
            c.name AS city_name,
            c.state AS city_state,
            h.address,
            h.phone,
            h.status,
            h.created_at,
            h.updated_at
        FROM hubs h
        INNER JOIN cities c
            ON h.city_id = c.id
        WHERE h.city_id = $1
        ORDER BY h.name ASC
    `;

    const result = await pool.query(
        query,
        [city_id]
    );

    return result.rows;
};


// ========================================
// SEARCH HUB
// ========================================

const searchHubs = async (name) => {

    const query = `
        SELECT
            h.id,
            h.name,
            h.hub_code,
            h.city_id,
            c.name AS city_name,
            c.state AS city_state,
            h.address,
            h.phone,
            h.status,
            h.created_at,
            h.updated_at
        FROM hubs h
        INNER JOIN cities c
            ON h.city_id = c.id
        WHERE h.name ILIKE $1
        ORDER BY h.name ASC
    `;

    const result = await pool.query(
        query,
        [`%${name}%`]
    );

    return result.rows;
};


// ========================================
// FILTER HUB
// ========================================

const filterHubs = async (status) => {

    const query = `
        SELECT
            h.id,
            h.name,
            h.hub_code,
            h.city_id,
            c.name AS city_name,
            c.state AS city_state,
            h.address,
            h.phone,
            h.status,
            h.created_at,
            h.updated_at
        FROM hubs h
        INNER JOIN cities c
            ON h.city_id = c.id
        WHERE h.status = $1
        ORDER BY h.name ASC
    `;

    const result = await pool.query(
        query,
        [status]
    );

    return result.rows;
};


// ========================================
// UPDATE HUB
// ========================================

const updateHub = async (
    id,
    {
        name,
        hub_code,
        city_id,
        address,
        phone
    }
) => {

    const query = `
        UPDATE hubs
        SET
            name = $1,
            hub_code = $2,
            city_id = $3,
            address = $4,
            phone = $5,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
        RETURNING
            id,
            name,
            hub_code,
            city_id,
            address,
            phone,
            status,
            created_at,
            updated_at
    `;

    const values = [
        name,
        hub_code,
        city_id,
        address,
        phone,
        id
    ];

    const result = await pool.query(
        query,
        values
    );

    return result.rows[0];
};


// ========================================
// UPDATE HUB STATUS
// ========================================

const updateHubStatus = async (
    id,
    status
) => {

    const query = `
        UPDATE hubs
        SET
            status = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING
            id,
            name,
            hub_code,
            city_id,
            address,
            phone,
            status,
            created_at,
            updated_at
    `;

    const result = await pool.query(
        query,
        [status, id]
    );

    return result.rows[0];
};


module.exports = {

    createHub,
    getAllHubs,
    getHubById,
    findHubByCode,
    findHubByNameAndCity,
    getHubsByCity,
    searchHubs,
    filterHubs,
    updateHub,
    updateHubStatus

};