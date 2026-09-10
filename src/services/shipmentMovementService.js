const { pool } = require("../config/db");

const shipmentMovementModel =
  require("../models/shipmentMovementModel");


// ==========================================
// Create Hub Movement
// ==========================================

const createMovement = async (
  shipmentId,
  toHubId,
  remark
) => {

  const client = await pool.connect();

  try {

    // ==========================================
    // START TRANSACTION
    // ==========================================

    await client.query("BEGIN");


    // ==========================================
    // 1. Find Shipment
    // ==========================================

    const shipment =
      await shipmentMovementModel.findShipmentById(
        client,
        shipmentId
      );


    if (!shipment) {

      throw new Error(
        "Shipment not found"
      );

    }


    // ==========================================
    // 2. Check Shipment Status
    // ==========================================

    if (
      shipment.shipment_status !== "PICKED_UP" &&
      shipment.shipment_status !== "IN_TRANSIT"
    ) {

      throw new Error(
        `Shipment cannot be moved because current status is ${shipment.shipment_status}`
      );

    }


    // ==========================================
    // 3. Get Current Hub
    // ==========================================

    const latestMovement =
      await shipmentMovementModel.getLatestMovement(
        client,
        shipmentId
      );


    let fromHubId;


    if (latestMovement) {

      // Shipment is currently at the
      // destination hub of the latest movement

      fromHubId =
        latestMovement.to_hub_id;

    } else {

      // First movement starts from
      // pickup hub

      fromHubId =
        shipment.pickup_hub_id;

    }


    // ==========================================
    // 4. Check Destination Hub
    // ==========================================

    const toHub =
      await shipmentMovementModel.findHubById(
        client,
        toHubId
      );


    if (!toHub) {

      throw new Error(
        "Destination hub not found"
      );

    }


    // ==========================================
    // 5. Check Destination Hub Status
    // ==========================================

    if (toHub.status !== "ACTIVE") {

      throw new Error(
        "Destination hub is not active"
      );

    }


    // ==========================================
    // 6. Same Hub Check
    // ==========================================

    if (fromHubId === toHubId) {

      throw new Error(
        "Shipment is already at this hub"
      );

    }


    // ==========================================
    // 7. Create Movement
    // ==========================================

    const movement =
      await shipmentMovementModel.createMovement(
        client,
        {
          shipment_id: shipmentId,

          from_hub_id: fromHubId,

          to_hub_id: toHubId,

          status: "IN_TRANSIT",

          remark: remark
        }
      );


    // ==========================================
    // 8. Update Shipment Status
    // ==========================================

    await shipmentMovementModel.updateShipmentStatus(
      client,
      shipmentId,
      "IN_TRANSIT"
    );


    // ==========================================
    // 9. COMMIT
    // ==========================================

    await client.query("COMMIT");


    return movement;


  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }

};


// ==========================================
// Get Shipment Movement History
// ==========================================

const getShipmentMovements = async (
  shipmentId
) => {

  return await shipmentMovementModel
    .getShipmentMovements(
      shipmentId
    );

};


// ==========================================
// Export
// ==========================================

module.exports = {

  createMovement,

  getShipmentMovements

};