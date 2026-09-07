const { pool } = require("../config/db");

const createUser = async ({
  name,
  email,
  phone,
  passwordHash,
  role,
}) => {
  const query = `
    INSERT INTO users
    (
      name,
      email,
      phone,
      password_hash,
      role
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING
      id,
      name,
      email,
      phone,
      role,
      status,
      created_at;
  `;

  const values = [
    name,
    email,
    phone,
    passwordHash,
    role,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const query = `
    SELECT *
    FROM users
    WHERE email = $1
    LIMIT 1;
  `;

  const result = await pool.query(query, [email]);

  return result.rows[0];
};

const findUserById = async (id) => {
  const query = `
    SELECT
      id,
      name,
      email,
      phone,
      role,
      status,
      created_at
    FROM users
    WHERE id = $1
    LIMIT 1;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};