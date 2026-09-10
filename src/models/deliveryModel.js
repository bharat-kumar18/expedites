const { pool } = require("../config/db");


// ==========================================
// Find Shipment
// ==========================================

const findShipmentById = async (
  client,
  shipmentId
) => {

  const result = await client.query(
    `
    SELECT
      id,
      tracking_number,
      customer_id,
      shipment_status,
      pickup_hub_id,
      delivery_hub_id,
      delivery_pincode,
      receiver_name,
      receiver_phone,
      receiver_address

    FROM shipments

    WHERE id = $1
    `,
    [shipmentId]
  );


  return result.rows[0];

};


// ==========================================
// Find Delivery Agent
// ==========================================

const findDeliveryAgentById = async (
  client,
  agentId
) => {

  const result = await client.query(
    `
    SELECT
      id,
      name,
      email,
      phone,
      role,
      status

    FROM users

    WHERE id = $1
      AND role = 'DELIVERY_AGENT'
    `,
    [agentId]
  );


  return result.rows[0];

};


// ==========================================
// Find Existing Delivery
// ==========================================

const findDeliveryByShipmentId = async (
  client,
  shipmentId
) => {

  const result = await client.query(
    `
    SELECT *

    FROM deliveries

    WHERE shipment_id = $1
    `,
    [shipmentId]
  );


  return result.rows[0];

};


// ==========================================
// Create Delivery Assignment
// ==========================================

const createDelivery = async (
  client,
  deliveryData
) => {

  const {
    shipment_id,
    delivery_agent_id,
    status
  } = deliveryData;


  const result = await client.query(
    `
    INSERT INTO deliveries
    (
      shipment_id,
      delivery_agent_id,
      status,
      assigned_at
    )

    VALUES
    (
      $1,
      $2,
      $3,
      CURRENT_TIMESTAMP
    )

    RETURNING *
    `,
    [
      shipment_id,
      delivery_agent_id,
      status
    ]
  );


  return result.rows[0];

};


// ==========================================
// Update Shipment Status
// ==========================================

const updateShipmentStatus = async (
  client,
  shipmentId,
  status
) => {

  const result = await client.query(
    `
    UPDATE shipments

    SET
      shipment_status = $1,
      updated_at = CURRENT_TIMESTAMP

    WHERE id = $2

    RETURNING *
    `,
    [
      status,
      shipmentId
    ]
  );


  return result.rows[0];

};


// ==========================================
// Get My Deliveries
// ==========================================

const getMyDeliveries = async (
  agentId,
  status
) => {

  let query = `
    SELECT

      d.id AS delivery_id,

      d.shipment_id,

      d.delivery_agent_id,

      d.status AS delivery_status,

      d.assigned_at,

      d.accepted_at,

      d.out_for_delivery_at,

      d.delivered_at,

      d.failure_reason,

      d.remark,

      s.tracking_number,

      s.pickup_name,

      s.pickup_phone,

      s.pickup_address,

      s.pickup_pincode,

      s.pickup_hub_id,

      s.receiver_name,

      s.receiver_phone,

      s.receiver_address,

      s.delivery_pincode,

      s.delivery_hub_id,

      s.shipment_status,

      s.package_type,

      s.package_weight,

      s.shipping_charge

    FROM deliveries d

    JOIN shipments s
      ON d.shipment_id = s.id

    WHERE d.delivery_agent_id = $1
  `;


  const values = [agentId];


  // ==========================================
  // Optional Status Filter
  // ==========================================

  if (status) {

    query += `
      AND d.status = $2
    `;

    values.push(status);

  }


  query += `
    ORDER BY d.assigned_at DESC
  `;


  const result = await pool.query(
    query,
    values
  );


  return result.rows;

};


// ==========================================
// Accept Delivery
// ==========================================

const acceptDelivery = async (
  client,
  shipmentId,
  agentId
) => {

  const result = await client.query(
    `
    UPDATE deliveries

    SET
      status = 'ACCEPTED',

      accepted_at =
        CURRENT_TIMESTAMP,

      updated_at =
        CURRENT_TIMESTAMP

    WHERE shipment_id = $1

      AND delivery_agent_id = $2

      AND status = 'ASSIGNED'

    RETURNING *
    `,
    [
      shipmentId,
      agentId
    ]
  );


  return result.rows[0];

};


// ==========================================
// Start Delivery
// ==========================================

const startDelivery = async (
  client,
  shipmentId,
  agentId
) => {

  const result = await client.query(
    `
    UPDATE deliveries

    SET
      status = 'OUT_FOR_DELIVERY',

      out_for_delivery_at =
        CURRENT_TIMESTAMP,

      updated_at =
        CURRENT_TIMESTAMP

    WHERE shipment_id = $1

      AND delivery_agent_id = $2

      AND status = 'ACCEPTED'

    RETURNING *
    `,
    [
      shipmentId,
      agentId
    ]
  );


  return result.rows[0];

};


// ==========================================
// Complete Delivery
// ==========================================

const completeDelivery = async (
  client,
  shipmentId,
  agentId,
  remark
) => {

  const result = await client.query(
    `
    UPDATE deliveries

    SET
      status = 'DELIVERED',

      delivered_at =
        CURRENT_TIMESTAMP,

      remark = $3,

      updated_at =
        CURRENT_TIMESTAMP

    WHERE shipment_id = $1

      AND delivery_agent_id = $2

      AND status = 'OUT_FOR_DELIVERY'

    RETURNING *
    `,
    [
      shipmentId,
      agentId,
      remark || null
    ]
  );


  return result.rows[0];

};


// ==========================================
// Fail Delivery
// ==========================================

const failDelivery = async (
  client,
  shipmentId,
  agentId,
  failureReason,
  remark
) => {

  const result = await client.query(
    `
    UPDATE deliveries

    SET
      status = 'FAILED',

      failure_reason = $3,

      remark = $4,

      updated_at =
        CURRENT_TIMESTAMP

    WHERE shipment_id = $1

      AND delivery_agent_id = $2

      AND status = 'OUT_FOR_DELIVERY'

    RETURNING *
    `,
    [
      shipmentId,
      agentId,
      failureReason,
      remark || null
    ]
  );


  return result.rows[0];

};


// ==========================================
// Get Delivery By Shipment
// ==========================================

const getDeliveryByShipmentId = async (
  shipmentId
) => {

  const result = await pool.query(
    `
    SELECT

      d.*,

      u.name AS delivery_agent_name,

      u.phone AS delivery_agent_phone,

      u.email AS delivery_agent_email

    FROM deliveries d

    JOIN users u
      ON d.delivery_agent_id = u.id

    WHERE d.shipment_id = $1
    `,
    [shipmentId]
  );


  return result.rows[0];

};


// ==========================================
// Export
// ==========================================

module.exports = {

  findShipmentById,

  findDeliveryAgentById,

  findDeliveryByShipmentId,

  createDelivery,

  updateShipmentStatus,

  getMyDeliveries,

  acceptDelivery,

  startDelivery,

  completeDelivery,

  failDelivery,

  getDeliveryByShipmentId

};