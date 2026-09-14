const { pool } = require("../config/db");


// ==========================================
// Find Shipment
// ==========================================

const findShipmentById = async (client, shipmentId) => {

  const result = await client.query(
    `
    SELECT
      id,
      tracking_number,
      customer_id,
      shipping_charge,
      shipment_status
    FROM shipments
    WHERE id = $1
    `,
    [shipmentId]
  );

  return result.rows[0];

};


// ==========================================
// Find Existing Shipment Cost
// ==========================================

const findShipmentCostByShipmentId = async (
  client,
  shipmentId
) => {

  const result = await client.query(
    `
    SELECT *
    FROM shipment_costs
    WHERE shipment_id = $1
    `,
    [shipmentId]
  );

  return result.rows[0];

};


// ==========================================
// Create Shipment Cost
// ==========================================

const createShipmentCost = async (
  client,
  costData
) => {

  const {
    shipment_id,
    distance_km,
    fuel_cost,
    labour_cost,
    transport_cost,
    total_cost,
    shipping_revenue,
    company_margin
  } = costData;


  const result = await client.query(
    `
    INSERT INTO shipment_costs
    (
      shipment_id,

      distance_km,

      fuel_cost,

      labour_cost,

      transport_cost,

      total_cost,

      shipping_revenue,

      company_margin

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
      $8
    )
    RETURNING *
    `,
    [
      shipment_id,
      distance_km,
      fuel_cost,
      labour_cost,
      transport_cost,
      total_cost,
      shipping_revenue,
      company_margin
    ]
  );


  return result.rows[0];

};


// ==========================================
// Update Shipment Cost
// ==========================================

const updateShipmentCost = async (
  client,
  shipmentId,
  costData
) => {

  const {
    distance_km,
    fuel_cost,
    labour_cost,
    transport_cost,
    total_cost,
    shipping_revenue,
    company_margin
  } = costData;


  const result = await client.query(
    `
    UPDATE shipment_costs

    SET

      distance_km = $1,

      fuel_cost = $2,

      labour_cost = $3,

      transport_cost = $4,

      total_cost = $5,

      shipping_revenue = $6,

      company_margin = $7,

      updated_at = CURRENT_TIMESTAMP

    WHERE shipment_id = $8

    RETURNING *
    `,
    [
      distance_km,
      fuel_cost,
      labour_cost,
      transport_cost,
      total_cost,
      shipping_revenue,
      company_margin,
      shipmentId
    ]
  );


  return result.rows[0];

};


// ==========================================
// Get Shipment Cost
// ==========================================

const getShipmentCost = async (
  shipmentId
) => {

  const result = await pool.query(
    `
    SELECT
      sc.id,

      sc.shipment_id,

      s.tracking_number,

      s.customer_id,

      sc.distance_km,

      sc.fuel_cost,

      sc.labour_cost,

      sc.transport_cost,

      sc.total_cost,

      sc.shipping_revenue,

      sc.company_margin,

      sc.created_at,

      sc.updated_at

    FROM shipment_costs sc

    JOIN shipments s
      ON sc.shipment_id = s.id

    WHERE sc.shipment_id = $1
    `,
    [shipmentId]
  );


  return result.rows[0];

};


// ==========================================
// Get All Shipment Costs
// ==========================================

const getAllShipmentCosts = async (
  page = 1,
  limit = 10
) => {

  const offset = (page - 1) * limit;


  const result = await pool.query(
    `
    SELECT

      sc.id,

      sc.shipment_id,

      s.tracking_number,

      sc.distance_km,

      sc.fuel_cost,

      sc.labour_cost,

      sc.transport_cost,

      sc.total_cost,

      sc.shipping_revenue,

      sc.company_margin,

      sc.created_at,

      sc.updated_at

    FROM shipment_costs sc

    JOIN shipments s
      ON sc.shipment_id = s.id

    ORDER BY sc.created_at DESC

    LIMIT $1
    OFFSET $2
    `,
    [
      limit,
      offset
    ]
  );


  const countResult = await pool.query(
    `
    SELECT COUNT(*) AS total
    FROM shipment_costs
    `
  );


  return {

    data: result.rows,

    pagination: {

      page,

      limit,

      total: Number(
        countResult.rows[0].total
      ),

      totalPages: Math.ceil(
        Number(countResult.rows[0].total) / limit
      )

    }

  };

};


// ==========================================
// Export
// ==========================================

module.exports = {

  findShipmentById,

  findShipmentCostByShipmentId,

  createShipmentCost,

  updateShipmentCost,

  getShipmentCost,

  getAllShipmentCosts

};