const { pool } = require("../config/db");


// ==========================================
// Find Shipment For Payment
// ==========================================

const findShipmentForPayment = async (
  client,
  shipmentId
) => {

  const result = await client.query(
    `
    SELECT
      id,
      tracking_number,
      customer_id,
      shipping_charge,
      payment_status,
      shipment_status
    FROM shipments
    WHERE id = $1
    FOR UPDATE
    `,
    [shipmentId]
  );

  return result.rows[0];

};


// ==========================================
// Find Existing Shipment Payment
// ==========================================

const findShipmentPayment = async (
  client,
  shipmentId,
  customerId
) => {

  const result = await client.query(
    `
    SELECT *
    FROM payments
    WHERE shipment_id = $1
      AND customer_id = $2
      AND payment_type = 'SHIPMENT_PAYMENT'
    ORDER BY created_at DESC
    LIMIT 1
    FOR UPDATE
    `,
    [
      shipmentId,
      customerId
    ]
  );

  return result.rows[0];

};


// ==========================================
// Create Shipment Payment
// ==========================================

const createShipmentPayment = async (
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
      gateway
    )
    VALUES
    (
      $1,
      $2,
      'SHIPMENT_PAYMENT',
      $3,
      $4,
      'PENDING',
      'INTERNAL_WALLET'
    )
    RETURNING *
    `,
    [
      data.customer_id,
      data.shipment_id,
      data.payment_method,
      data.amount
    ]
  );

  return result.rows[0];

};


// ==========================================
// Update Shipment Payment
// ==========================================

const updateShipmentPayment = async (
  client,
  paymentId,
  data
) => {

  const result = await client.query(
    `
    UPDATE payments
    SET
      status = $1,
      gateway_payment_id =
        COALESCE($2, gateway_payment_id),
      gateway_response =
        COALESCE($3, gateway_response),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING *
    `,
    [
      data.status,
      data.gateway_payment_id || null,
      data.gateway_response || null,
      paymentId
    ]
  );

  return result.rows[0];

};


// ==========================================
// Mark Shipment Paid
// ==========================================

const markShipmentPaid = async (
  client,
  shipmentId
) => {

  const result = await client.query(
    `
    UPDATE shipments
    SET
      payment_status = 'PAID',
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
    `,
    [shipmentId]
  );

  return result.rows[0];

};


// ==========================================
// Get Shipment Payment
// ==========================================

const getShipmentPayment = async (
  shipmentId,
  customerId
) => {

  const result = await pool.query(
    `
    SELECT
      p.*,
      s.tracking_number,
      s.shipping_charge,
      s.payment_status AS shipment_payment_status

    FROM payments p

    JOIN shipments s
      ON p.shipment_id = s.id

    WHERE p.shipment_id = $1
      AND p.customer_id = $2
      AND p.payment_type = 'SHIPMENT_PAYMENT'

    ORDER BY p.created_at DESC

    LIMIT 1
    `,
    [
      shipmentId,
      customerId
    ]
  );

  return result.rows[0];

};


// ==========================================
// Get All Shipment Payments
// ==========================================

const getAllShipmentPayments = async (
  page = 1,
  limit = 10
) => {

  const offset =
    (page - 1) * limit;

  const result =
    await pool.query(
      `
      SELECT
        p.id,
        p.customer_id,
        p.shipment_id,
        p.payment_method,
        p.amount,
        p.status,
        p.gateway,
        p.gateway_payment_id,
        p.created_at,
        p.updated_at,
        s.tracking_number,
        s.payment_status AS shipment_payment_status

      FROM payments p

      JOIN shipments s
        ON p.shipment_id = s.id

      WHERE p.payment_type =
        'SHIPMENT_PAYMENT'

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
      WHERE payment_type =
        'SHIPMENT_PAYMENT'
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


module.exports = {

  findShipmentForPayment,
  findShipmentPayment,
  createShipmentPayment,
  updateShipmentPayment,
  markShipmentPaid,
  getShipmentPayment,
  getAllShipmentPayments

};