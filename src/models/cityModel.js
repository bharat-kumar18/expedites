const { pool } = require("../config/db");


// ========================================
// CREATE CITY
// ========================================

const createCity = async ({
    name,
    state,
    country
}) => {

    const query = `
        INSERT INTO cities (
            name,
            state,
            country
        )
        VALUES ($1, $2, $3)
        RETURNING
            id,
            name,
            state,
            country,
            status,
            created_at,
            updated_at
    `;

    const values = [
        name,
        state,
        country
    ];

    const result = await pool.query(
        query,
        values
    );

    return result.rows[0];
};


// ========================================
// GET ALL CITIES
// ========================================

const getAllCities = async () => {

    const query = `
        SELECT
            id,
            name,
            state,
            country,
            status,
            created_at,
            updated_at
        FROM cities
        ORDER BY created_at DESC
    `;

    const result = await pool.query(query);

    return result.rows;
};


// ========================================
// GET CITY BY ID
// ========================================

const getCityById = async (id) => {

    const query = `
        SELECT
            id,
            name,
            state,
            country,
            status,
            created_at,
            updated_at
        FROM cities
        WHERE id = $1
        LIMIT 1
    `;

    const result = await pool.query(
        query,
        [id]
    );

    return result.rows[0];
};


// ========================================
// SEARCH CITY
// ========================================

const searchCities = async (name) => {

    const query = `
        SELECT
            id,
            name,
            state,
            country,
            status,
            created_at,
            updated_at
        FROM cities
        WHERE name ILIKE $1
        ORDER BY name ASC
    `;

    const values = [
        `%${name}%`
    ];

    const result = await pool.query(
        query,
        values
    );

    return result.rows;
};


// ========================================
// FILTER CITIES
// ========================================

const filterCities = async (status) => {

    const query = `
        SELECT
            id,
            name,
            state,
            country,
            status,
            created_at,
            updated_at
        FROM cities
        WHERE status = $1
        ORDER BY name ASC
    `;

    const result = await pool.query(
        query,
        [status]
    );

    return result.rows;
};


// ========================================
// CHECK DUPLICATE CITY
// ========================================

const findCityByNameAndState = async (
    name,
    state
) => {

    const query = `
        SELECT
            id,
            name,
            state,
            country,
            status
        FROM cities
        WHERE LOWER(name) = LOWER($1)
        AND LOWER(state) = LOWER($2)
        LIMIT 1
    `;

    const result = await pool.query(
        query,
        [name, state]
    );

    return result.rows[0];
};


// ========================================
// UPDATE CITY
// ========================================

const updateCity = async (
    id,
    {
        name,
        state,
        country
    }
) => {

    const query = `
        UPDATE cities
        SET
            name = $1,
            state = $2,
            country = $3,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING
            id,
            name,
            state,
            country,
            status,
            created_at,
            updated_at
    `;

    const values = [
        name,
        state,
        country,
        id
    ];

    const result = await pool.query(
        query,
        values
    );

    return result.rows[0];
};


// ========================================
// UPDATE CITY STATUS
// ========================================

const updateCityStatus = async (
    id,
    status
) => {

    const query = `
        UPDATE cities
        SET
            status = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING
            id,
            name,
            state,
            country,
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
    createCity,
    getAllCities,
    getCityById,
    searchCities,
    filterCities,
    findCityByNameAndState,
    updateCity,
    updateCityStatus
};