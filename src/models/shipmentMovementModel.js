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
      shipment_status,
      pickup_hub_id,
      delivery_hub_id

    FROM shipments

    WHERE id = $1
    `,
    [shipmentId]
  );


  return result.rows[0];

};


// ==========================================
// Get Latest Shipment Movement
// ==========================================

const getLatestMovement = async (
  client,
  shipmentId
) => {

  const result = await client.query(
    `
    SELECT
      id,
      shipment_id,
      from_hub_id,
      to_hub_id,
      status,
      dispatched_at,
      arrived_at,
      completed_at,
      remark,
      created_at

    FROM shipment_hub_movements

    WHERE shipment_id = $1

    ORDER BY created_at DESC

    LIMIT 1
    `,
    [shipmentId]
  );


  return result.rows[0];

};


// ==========================================
// Find Hub
// ==========================================

const findHubById = async (
  client,
  hubId
) => {

  const result = await client.query(
    `
    SELECT
      id,
      name,
      city_id,
      status

    FROM hubs

    WHERE id = $1
    `,
    [hubId]
  );


  return result.rows[0];

};


// ==========================================
// Create Movement
// ==========================================

const createMovement = async (
  client,
  movementData
) => {

  const {
    shipment_id,
    from_hub_id,
    to_hub_id,
    status,
    remark
  } = movementData;


  const result = await client.query(
    `
    INSERT INTO shipment_hub_movements
    (
      shipment_id,
      from_hub_id,
      to_hub_id,
      status,
      remark,
      dispatched_at
    )

    VALUES
    (
      $1,
      $2,
      $3,
      $4,
      $5,
      CURRENT_TIMESTAMP
    )

    RETURNING *
    `,
    [
      shipment_id,
      from_hub_id,
      to_hub_id,
      status,
      remark || null
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
// Get Shipment Movement History
// ==========================================

const getShipmentMovements = async (
  shipmentId
) => {

  const result = await pool.query(
    `
    SELECT

      m.id,

      m.shipment_id,

      m.from_hub_id,

      fh.name AS from_hub_name,

      m.to_hub_id,

      th.name AS to_hub_name,

      m.status,

      m.dispatched_at,

      m.arrived_at,

      m.completed_at,

      m.remark,

      m.created_at

    FROM shipment_hub_movements m

    JOIN hubs fh
      ON m.from_hub_id = fh.id

    JOIN hubs th
      ON m.to_hub_id = th.id

    WHERE m.shipment_id = $1

    ORDER BY m.created_at ASC
    `,
    [shipmentId]
  );


  return result.rows;

};


// ==========================================
// Export
// ==========================================

module.exports = {

  findShipmentById,

  getLatestMovement,

  findHubById,

  createMovement,

  updateShipmentStatus,

  getShipmentMovements

};