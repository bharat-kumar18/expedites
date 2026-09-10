const { pool } = require("../config/db");



// ==========================================
// Create Pickup Assignment
// ==========================================

const createPickup = async (client, pickupData) => {

  const {

    shipment_id,
    pickup_agent_id,
    status

  } = pickupData;


  const result = await client.query(
    `
    INSERT INTO pickups (
      shipment_id,
      pickup_agent_id,
      status
    )

    VALUES (
      $1,
      $2,
      $3
    )

    RETURNING *
    `,
    [
      shipment_id,
      pickup_agent_id,
      status
    ]
  );


  return result.rows[0];

};


// ==========================================
// Find Shipment
// ==========================================

const findShipmentById = async (
  client,
  shipmentId
) => {

  const result = await client.query(
    `
    SELECT *
    FROM shipments
    WHERE id = $1
    `,
    [shipmentId]
  );


  return result.rows[0];

};


// ==========================================
// Find Pickup Agent
// ==========================================

const findPickupAgentById = async (
  client,
  agentId
) => {

  const result = await client.query(
    `
    SELECT id, name, email, phone, role, status
    FROM users
    WHERE id = $1
      AND role = 'PICKUP_AGENT'
    `,
    [agentId]
  );


  return result.rows[0];

};


// ==========================================
// Find Existing Pickup
// ==========================================

const findPickupByShipmentId = async (
  client,
  shipmentId
) => {

  const result = await client.query(
    `
    SELECT *
    FROM pickups
    WHERE shipment_id = $1
    `,
    [shipmentId]
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
// Get My Pickups
// ==========================================

const getMyPickups = async (
  agentId,
  status
) => {

  let query = `
    SELECT

      p.id AS pickup_id,

      p.shipment_id,

      p.pickup_agent_id,

      p.status AS pickup_status,

      p.assigned_at,

      p.accepted_at,

      p.picked_up_at,

      p.failure_reason,

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

      s.shipment_status,

      s.package_type,

      s.package_weight,

      s.shipping_charge

    FROM pickups p

    JOIN shipments s
      ON p.shipment_id = s.id

    WHERE p.pickup_agent_id = $1
  `;


  const values = [agentId];


  // ==========================================
  // Optional Status Filter
  // ==========================================

  if (status) {

    query += `
      AND p.status = $2
    `;

    values.push(status);

  }


  query += `
    ORDER BY p.assigned_at DESC
  `;


  const result = await pool.query(
    query,
    values
  );


  return result.rows;

};

// ==========================================
// Accept Pickup
// ==========================================

const acceptPickup = async (
  client,
  shipmentId,
  agentId
) => {

  const result = await client.query(
    `
    UPDATE pickups

    SET
      status = 'ACCEPTED',
      accepted_at = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP

    WHERE shipment_id = $1
      AND pickup_agent_id = $2
      AND status = 'ASSIGNED'

    RETURNING *
    `,
    [shipmentId, agentId]
  );


  return result.rows[0];

};


// ==========================================
// Complete Pickup
// ==========================================

const completePickup = async (
    client,
    shipmentId,
    agentId
) => {

    const result = await client.query(
        `
        UPDATE pickups

        SET
            status = 'PICKED_UP',
            picked_up_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP

        WHERE shipment_id = $1
          AND pickup_agent_id = $2
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
// Export
// ==========================================

module.exports = {
  createPickup,
  findShipmentById,
  findPickupAgentById,
  findPickupByShipmentId,
  updateShipmentStatus,
  getMyPickups,
  acceptPickup,
  completePickup
};