const { pool } = require("../config/db");


// ==========================================
// Create COD
// ==========================================

const createCOD = async (
  client,
  data
) => {

  const result = await client.query(
    `
    INSERT INTO cod_payments
    (
      shipment_id,
      seller_id,
      delivery_agent_id,
      cod_amount,
      collection_status,
      reconciliation_status,
      settlement_status,
      seller_amount,
      company_fee
    )
    VALUES
    (
      $1,
      $2,
      $3,
      $4,
      'PENDING',
      'PENDING',
      'NOT_ELIGIBLE',
      $5,
      $6
    )
    RETURNING *
    `,
    [
      data.shipment_id,
      data.seller_id,
      data.delivery_agent_id || null,
      data.cod_amount,
      data.seller_amount || null,
      data.company_fee || null
    ]
  );

  return result.rows[0];

};


// ==========================================
// Find COD
// ==========================================

const findCODByShipmentId = async (
  client,
  shipmentId
) => {

  const result = await client.query(
    `
    SELECT *
    FROM cod_payments
    WHERE shipment_id = $1
    `,
    [shipmentId]
  );

  return result.rows[0];

};


// ==========================================
// Collect COD
// ==========================================

const collectCOD = async (
  client,
  shipmentId,
  agentId,
  method
) => {

  const result = await client.query(
    `
    UPDATE cod_payments
    SET
      delivery_agent_id = $1,
      collection_method = $2,
      collection_status = 'COLLECTED',
      collected_at = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP
    WHERE shipment_id = $3
      AND collection_status = 'PENDING'
    RETURNING *
    `,
    [
      agentId,
      method,
      shipmentId
    ]
  );

  return result.rows[0];

};


// ==========================================
// Reconcile COD
// ==========================================

const reconcileCOD = async (
  client,
  shipmentId
) => {

  const result = await client.query(
    `
    UPDATE cod_payments
    SET
      collection_status = 'RECONCILED',
      reconciliation_status = 'VERIFIED',
      reconciled_at = CURRENT_TIMESTAMP,
      settlement_eligible_at =
        CURRENT_TIMESTAMP + INTERVAL '3 days',
      settlement_status = 'ELIGIBLE',
      updated_at = CURRENT_TIMESTAMP
    WHERE shipment_id = $1
      AND collection_status = 'COLLECTED'
      AND reconciliation_status = 'PENDING'
    RETURNING *
    `,
    [shipmentId]
  );

  return result.rows[0];

};

// ==========================================
// Settle COD
// ==========================================

const settleCOD = async (
  client,
  shipmentId,
  settlementReference
) => {

  const result =
    await client.query(
      `
      UPDATE cod_payments

      SET
        settlement_status = 'SETTLED',

        settlement_reference = $1,

        settled_at = CURRENT_TIMESTAMP,

        updated_at = CURRENT_TIMESTAMP

      WHERE shipment_id = $2

        AND collection_status =
          'RECONCILED'

        AND reconciliation_status =
          'VERIFIED'

        AND settlement_status =
          'ELIGIBLE'

      RETURNING *
      `,
      [
        settlementReference,
        shipmentId
      ]
    );

  return result.rows[0];

};

// ==========================================
// Get COD
// ==========================================

const getCODByShipmentId = async (
  shipmentId
) => {

  const result = await pool.query(
    `
    SELECT
      cp.*,
      s.tracking_number,
      u.name AS seller_name
    FROM cod_payments cp

    JOIN shipments s
      ON cp.shipment_id = s.id

    JOIN users u
      ON cp.seller_id = u.id

    WHERE cp.shipment_id = $1
    `,
    [shipmentId]
  );

  return result.rows[0];

};


module.exports = {

  createCOD,
  findCODByShipmentId,
  collectCOD,
  reconcileCOD,
  settleCOD,
  getCODByShipmentId

};