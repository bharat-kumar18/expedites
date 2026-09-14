const { pool } = require("../config/db");


// ==========================================
// Create Payment
// ==========================================

const createPayment = async (
  client,
  data
) => {

  const result = await client.query(
    `
    INSERT INTO payments
    (
      customer_id,
      shipment_id,
      payment_type,
      payment_method,
      amount,
      status,
      gateway,
      gateway_order_id,
      gateway_payment_id,
      gateway_response
    )
    VALUES
    (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $7,
      $8,
      $9,
      $10
    )
    RETURNING *
    `,
    [
      data.customer_id,
      data.shipment_id || null,
      data.payment_type,
      data.payment_method,
      data.amount,
      data.status || "PENDING",
      data.gateway || null,
      data.gateway_order_id || null,
      data.gateway_payment_id || null,
      data.gateway_response || null
    ]
  );

  return result.rows[0];

};


// ==========================================
// Find Payment
// ==========================================

const findPaymentById = async (
  client,
  paymentId
) => {

  const result = await client.query(
    `
    SELECT *
    FROM payments
    WHERE id = $1
    `,
    [paymentId]
  );

  return result.rows[0];

};

// ==========================================
// Find Payment With Customer
// ==========================================

const findPaymentByIdAndCustomer = async (
  client,
  paymentId,
  customerId
) => {

  const result = await client.query(
    `
    SELECT *
    FROM payments
    WHERE id = $1
      AND customer_id = $2
    FOR UPDATE
    `,
    [
      paymentId,
      customerId
    ]
  );

  return result.rows[0];

};


// ==========================================
// Update Payment
// ==========================================

const updatePayment = async (
  client,
  paymentId,
  data
) => {

  const result = await client.query(
    `
    UPDATE payments
    SET
      status = COALESCE($1, status),
      gateway_payment_id =
        COALESCE($2, gateway_payment_id),
      gateway_response =
        COALESCE($3, gateway_response),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING *
    `,
    [
      data.status || null,
      data.gateway_payment_id || null,
      data.gateway_response || null,
      paymentId
    ]
  );

  return result.rows[0];

};


// ==========================================
// Payment History
// ==========================================

const getCustomerPayments = async (
  customerId
) => {

  const result = await pool.query(
    `
    SELECT *
    FROM payments
    WHERE customer_id = $1
    ORDER BY created_at DESC
    `,
    [customerId]
  );

  return result.rows;

};

// ==========================================
// Get All Payments
// ==========================================

const getAllPayments = async (
  page = 1,
  limit = 10
) => {

  const offset =
    (page - 1) * limit;

  const result =
    await pool.query(
      `
      SELECT
        p.*,
        u.name AS customer_name,
        u.email AS customer_email,
        s.tracking_number

      FROM payments p

      JOIN users u
        ON p.customer_id = u.id

      LEFT JOIN shipments s
        ON p.shipment_id = s.id

      ORDER BY p.created_at DESC

      LIMIT $1
      OFFSET $2
      `,
      [
        limit,
        offset
      ]
    );

  const countResult =
    await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM payments
      `
    );

  const total =
    Number(countResult.rows[0].total);

  return {

    data: result.rows,

    pagination: {

      page,
      limit,
      total,

      totalPages:
        Math.ceil(total / limit)

    }

  };

};


// ==========================================
// Payment Report
// ==========================================

const getPaymentReport = async () => {

  const result =
    await pool.query(
      `
      SELECT

        COUNT(*) AS total_payments,

        COUNT(*) FILTER (
          WHERE status = 'SUCCESS'
        ) AS successful_payments,

        COUNT(*) FILTER (
          WHERE status = 'PENDING'
        ) AS pending_payments,

        COUNT(*) FILTER (
          WHERE status = 'FAILED'
        ) AS failed_payments,

        COALESCE(
          SUM(amount)
          FILTER (
            WHERE status = 'SUCCESS'
          ),
          0
        ) AS successful_amount,

        COALESCE(
          SUM(amount)
          FILTER (
            WHERE status = 'PENDING'
          ),
          0
        ) AS pending_amount

      FROM payments
      `
    );

  return result.rows[0];

};


module.exports = {

  createPayment,
  findPaymentById,
  findPaymentByIdAndCustomer,
  updatePayment,
  getCustomerPayments,
  getAllPayments,
  getPaymentReport

};