const { pool } = require("../config/db");

const deliveryModel =
  require("../models/deliveryModel");


// ==========================================
// Assign Delivery Agent
// ==========================================

const assignDeliveryAgent = async (
  shipmentId,
  deliveryAgentId
) => {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");


    // ==========================================
    // 1. Find Shipment
    // ==========================================

    const shipment =
      await deliveryModel.findShipmentById(
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
      shipment.shipment_status !== "IN_TRANSIT"
    ) {

      throw new Error(
        `Delivery agent cannot be assigned because shipment status is ${shipment.shipment_status}`
      );

    }


    // ==========================================
    // 3. Find Delivery Agent
    // ==========================================

    const deliveryAgent =
      await deliveryModel.findDeliveryAgentById(
        client,
        deliveryAgentId
      );


    if (!deliveryAgent) {

      throw new Error(
        "Delivery agent not found"
      );

    }


    // ==========================================
    // 4. Check Agent Status
    // ==========================================

    if (
      deliveryAgent.status !== "ACTIVE"
    ) {

      throw new Error(
        "Delivery agent is not active"
      );

    }


    // ==========================================
    // 5. Check Existing Assignment
    // ==========================================

    const existingDelivery =
      await deliveryModel.findDeliveryByShipmentId(
        client,
        shipmentId
      );


    if (existingDelivery) {

      throw new Error(
        "Delivery agent is already assigned to this shipment"
      );

    }


    // ==========================================
    // 6. Create Delivery
    // ==========================================

    const delivery =
      await deliveryModel.createDelivery(
        client,
        {
          shipment_id: shipmentId,

          delivery_agent_id:
            deliveryAgentId,

          status: "ASSIGNED"
        }
      );


    // ==========================================
    // 7. Update Shipment Status
    // ==========================================

    await deliveryModel.updateShipmentStatus(
      client,
      shipmentId,
      "OUT_FOR_DELIVERY"
    );


    // ==========================================
    // 8. Commit
    // ==========================================

    await client.query("COMMIT");


    return delivery;


  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }

};


// ==========================================
// Get My Deliveries
// ==========================================

const getMyDeliveries = async (
  agentId,
  status
) => {

  return await deliveryModel.getMyDeliveries(
    agentId,
    status
  );

};


// ==========================================
// Accept Delivery
// ==========================================

const acceptDelivery = async (
  shipmentId,
  agentId
) => {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");


    const delivery =
      await deliveryModel.acceptDelivery(
        client,
        shipmentId,
        agentId
      );


    if (!delivery) {

      throw new Error(
        "Delivery not found, already accepted, or not assigned to this agent"
      );

    }


    // ==========================================
    // Shipment remains IN_TRANSIT
    // ==========================================

    await client.query("COMMIT");


    return delivery;


  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }

};


// ==========================================
// Start Delivery
// ==========================================

const startDelivery = async (
  shipmentId,
  agentId
) => {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");


    const delivery =
      await deliveryModel.startDelivery(
        client,
        shipmentId,
        agentId
      );


    if (!delivery) {

      throw new Error(
        "Delivery not found or delivery is not accepted"
      );

    }


    // ==========================================
    // Update Shipment
    // ==========================================

    await deliveryModel.updateShipmentStatus(
      client,
      shipmentId,
      "OUT_FOR_DELIVERY"
    );


    await client.query("COMMIT");


    return delivery;


  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }

};


// ==========================================
// Complete Delivery
// ==========================================

const completeDelivery = async (
  shipmentId,
  agentId,
  remark
) => {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");


    const delivery =
      await deliveryModel.completeDelivery(
        client,
        shipmentId,
        agentId,
        remark
      );


    if (!delivery) {

      throw new Error(
        "Delivery not found or shipment is not out for delivery"
      );

    }


    // ==========================================
    // Update Shipment
    // ==========================================

    await deliveryModel.updateShipmentStatus(
      client,
      shipmentId,
      "DELIVERED"
    );


    await client.query("COMMIT");


    return delivery;


  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }

};


// ==========================================
// Fail Delivery
// ==========================================

const failDelivery = async (
  shipmentId,
  agentId,
  failureReason,
  remark
) => {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");


    const delivery =
      await deliveryModel.failDelivery(
        client,
        shipmentId,
        agentId,
        failureReason,
        remark
      );


    if (!delivery) {

      throw new Error(
        "Delivery not found or shipment is not out for delivery"
      );

    }


    // ==========================================
    // Update Shipment
    // ==========================================

    await deliveryModel.updateShipmentStatus(
      client,
      shipmentId,
      "RETURNED"
    );


    await client.query("COMMIT");


    return delivery;


  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }

};


// ==========================================
// Get Delivery By Shipment
// ==========================================

const getDeliveryByShipmentId = async (
  shipmentId
) => {

  const delivery =
    await deliveryModel.getDeliveryByShipmentId(
      shipmentId
    );


  if (!delivery) {

    throw new Error(
      "Delivery assignment not found"
    );

  }


  return delivery;

};


// ==========================================
// Export
// ==========================================

module.exports = {

  assignDeliveryAgent,

  getMyDeliveries,

  acceptDelivery,

  startDelivery,

  completeDelivery,

  failDelivery,

  getDeliveryByShipmentId

};