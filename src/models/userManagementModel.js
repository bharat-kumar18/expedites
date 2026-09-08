const { pool } = require("../config/db");


// ========================================
// GET ALL USERS
// ========================================

const getAllUsers = async () => {

  const query = `
    SELECT
      id,
      name,
      email,
      phone,
      role,
      status,
      created_at,
      updated_at
    FROM users
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query);

  return result.rows;
};


// ========================================
// SEARCH USERS
// BY NAME / EMAIL / PHONE
// ========================================

const searchUsers = async ({
  name,
  email,
  phone,
}) => {

  let query = `
    SELECT
      id,
      name,
      email,
      phone,
      role,
      status,
      created_at,
      updated_at
    FROM users
    WHERE 1 = 1
  `;

  const values = [];

  // Search by name
  if (name) {

    values.push(`%${name}%`);

    query += `
      AND name ILIKE $${values.length}
    `;
  }

  // Search by email
  if (email) {

    values.push(`%${email}%`);

    query += `
      AND email ILIKE $${values.length}
    `;
  }

  // Search by phone
  if (phone) {

    values.push(`%${phone}%`);

    query += `
      AND phone ILIKE $${values.length}
    `;
  }

  query += `
    ORDER BY created_at DESC
  `;

  const result = await pool.query(
    query,
    values
  );

  return result.rows;
};


// ========================================
// FILTER USERS
// BY ROLE / STATUS
// ========================================

const filterUsers = async ({
  role,
  status,
}) => {

  let query = `
    SELECT
      id,
      name,
      email,
      phone,
      role,
      status,
      created_at,
      updated_at
    FROM users
    WHERE 1 = 1
  `;

  const values = [];

  // Filter by role
  if (role) {

    values.push(role);

    query += `
      AND role = $${values.length}
    `;
  }

  // Filter by status
  if (status) {

    values.push(status);

    query += `
      AND status = $${values.length}
    `;
  }

  query += `
    ORDER BY created_at DESC
  `;

  const result = await pool.query(
    query,
    values
  );

  return result.rows;
};


// ========================================
// GET SINGLE USER
// ========================================

const getUserById = async (id) => {

  const query = `
    SELECT
      id,
      name,
      email,
      phone,
      role,
      status,
      created_at,
      updated_at
    FROM users
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
// UPDATE USER
// ========================================

const updateUser = async (
  id,
  {
    name,
    email,
    phone,
  }
) => {

  const query = `
    UPDATE users
    SET
      name = $1,
      email = $2,
      phone = $3,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING
      id,
      name,
      email,
      phone,
      role,
      status,
      created_at,
      updated_at
  `;

  const values = [
    name,
    email,
    phone,
    id,
  ];

  const result = await pool.query(
    query,
    values
  );

  return result.rows[0];
};


// ========================================
// UPDATE STATUS
// ========================================

const updateUserStatus = async (
  id,
  status
) => {

  const query = `
    UPDATE users
    SET
      status = $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING
      id,
      name,
      email,
      phone,
      role,
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
  getAllUsers,
  searchUsers,
  filterUsers,
  getUserById,
  updateUser,
  updateUserStatus,
};