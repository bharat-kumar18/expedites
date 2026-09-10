const { pool } = require("../config/db");


// ==========================================
// Find Shipment By Tracking Number
// ==========================================

const findShipmentByTrackingNumber = async (
  trackingNumber
) => {

  const result = await pool.query(
    `
    SELECT

      s.id,
      s.tracking_number,

      s.customer_id,

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

      s.package_type,
      s.package_weight,

      s.shipping_charge,
      s.payment_status,

      s.shipment_status,

      s.current_hub_id,

      s.created_at,
      s.updated_at,

      ph.name AS pickup_hub_name,
      ph.city_id AS pickup_city_id,

      dh.name AS delivery_hub_name,
      dh.city_id AS delivery_city_id,

      ch.name AS current_hub_name,
      ch.city_id AS current_city_id

    FROM shipments s

    LEFT JOIN hubs ph
      ON s.pickup_hub_id = ph.id

    LEFT JOIN hubs dh
      ON s.delivery_hub_id = dh.id

    LEFT JOIN hubs ch
      ON s.current_hub_id = ch.id

    WHERE s.tracking_number = $1

    LIMIT 1
    `,
    [trackingNumber]
  );


  return result.rows[0];

};


// ==========================================
// Get Hub Movement History
// ==========================================

const getHubMovements = async (
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

    LEFT JOIN hubs fh
      ON m.from_hub_id = fh.id

    LEFT JOIN hubs th
      ON m.to_hub_id = th.id

    WHERE m.shipment_id = $1

    ORDER BY m.created_at ASC
    `,
    [shipmentId]
  );


  return result.rows;

};


// ==========================================
// Get Pickup Information
// ==========================================

const getPickupInformation = async (
  shipmentId
) => {

  const result = await pool.query(
    `
    SELECT

      p.id AS pickup_id,

      p.shipment_id,

      p.pickup_agent_id,

      u.name AS pickup_agent_name,

      u.phone AS pickup_agent_phone,

      p.status AS pickup_status,

      p.assigned_at,
      p.accepted_at,
      p.picked_up_at,

      p.failure_reason,
      p.remark

    FROM pickups p

    LEFT JOIN users u
      ON p.pickup_agent_id = u.id

    WHERE p.shipment_id = $1

    LIMIT 1
    `,
    [shipmentId]
  );


  return result.rows[0];

};


// ==========================================
// Get Delivery Information
// ==========================================

const getDeliveryInformation = async (
  shipmentId
) => {

  const result = await pool.query(
    `
    SELECT

      d.id AS delivery_id,

      d.shipment_id,

      d.delivery_agent_id,

      u.name AS delivery_agent_name,

      u.phone AS delivery_agent_phone,

      d.status AS delivery_status,

      d.assigned_at,
      d.accepted_at,
      d.out_for_delivery_at,
      d.delivered_at,

      d.failure_reason,
      d.remark

    FROM deliveries d

    LEFT JOIN users u
      ON d.delivery_agent_id = u.id

    WHERE d.shipment_id = $1

    LIMIT 1
    `,
    [shipmentId]
  );


  return result.rows[0];

};


// ==========================================
// Export
// ==========================================

module.exports = {

  findShipmentByTrackingNumber,

  getHubMovements,

  getPickupInformation,

  getDeliveryInformation

};