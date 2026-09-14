const { pool } = require("../config/db");


// ==========================================
// Find Payment
// ==========================================

const findPayment = async (
  client,
  paymentId
) => {

  const result =
    await client.query(
      `
      SELECT *
      FROM payments
      WHERE id = $1
      FOR UPDATE
      `,
      [paymentId]
    );

  return result.rows[0];

};


// ==========================================
// Find Existing Refund
// ==========================================

const findRefundByPaymentId = async (
  client,
  paymentId
) => {

  const result =
    await client.query(
      `
      SELECT *
      FROM refunds
      WHERE payment_id = $1
      ORDER BY created_at DESC
      LIMIT 1
      FOR UPDATE
      `,
      [paymentId]
    );

  return result.rows[0];

};


// ==========================================
// Create Refund
// ==========================================

const createRefund = async (
  client,
  data
) => {

  const result =
    await client.query(
      `
      INSERT INTO refunds
      (
        payment_id,
        shipment_id,
        customer_id,
        refund_amount,
        refund_reason,
        refund_method,
        status
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        'PENDING'
      )
      RETURNING *
      `,
      [
        data.payment_id,
        data.shipment_id,
        data.customer_id,
        data.refund_amount,
        data.refund_reason,
        data.refund_method
      ]
    );

  return result.rows[0];

};


// ==========================================
// Update Refund
// ==========================================

const updateRefund = async (
  client,
  refundId,
  data
) => {

  const result =
    await client.query(
      `
      UPDATE refunds
      SET
        status = COALESCE($1, status),
        gateway_refund_id =
          COALESCE($2, gateway_refund_id),
        gateway_response =
          COALESCE($3, gateway_response),
        processed_at =
          CASE
            WHEN $1 = 'SUCCESS'
            THEN CURRENT_TIMESTAMP
            ELSE processed_at
          END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
      `,
      [
        data.status || null,
        data.gateway_refund_id || null,
        data.gateway_response || null,
        refundId
      ]
    );

  return result.rows[0];

};


// ==========================================
// Get Customer Refunds
// ==========================================

const getCustomerRefunds = async (
  customerId
) => {

  const result =
    await pool.query(
      `
      SELECT
        r.*,
        p.payment_type,
        p.payment_method,
        s.tracking_number

      FROM refunds r

      JOIN payments p
        ON r.payment_id = p.id

      LEFT JOIN shipments s
        ON r.shipment_id = s.id

      WHERE r.customer_id = $1

      ORDER BY r.created_at DESC
      `,
      [customerId]
    );

  return result.rows;

};


// ==========================================
// Get All Refunds
// ==========================================

const getAllRefunds = async (
  page = 1,
  limit = 10
) => {

  const offset =
    (page - 1) * limit;

  const result =
    await pool.query(
      `
      SELECT
        r.*,
        p.payment_method,
        p.amount AS payment_amount,
        s.tracking_number

      FROM refunds r

      JOIN payments p
        ON r.payment_id = p.id

      LEFT JOIN shipments s
        ON r.shipment_id = s.id

      ORDER BY r.created_at DESC

      LIMIT $1
      OFFSET $2
      `,
      [
        limit,
        offset
      ]
    );

  const count =
    await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM refunds
      `
    );

  const total =
    Number(count.rows[0].total);

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


module.exports = {

  findPayment,
  findRefundByPaymentId,
  createRefund,
  updateRefund,
  getCustomerRefunds,
  getAllRefunds

};