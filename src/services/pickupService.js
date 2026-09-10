const { pool } = require("../config/db");


const pickupModel =
  require("../models/pickupModel");


// ==========================================
// Assign Pickup Agent
// ==========================================

const assignPickupAgent = async (
  shipmentId,
  pickupAgentId
) => {

  const client = await pool.connect();


  try {

    await client.query("BEGIN");


    // ==========================================
    // 1. Check Shipment
    // ==========================================

    const shipment =
      await pickupModel.findShipmentById(
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
      shipment.shipment_status !== "BOOKED"
    ) {

      throw new Error(
        `Pickup agent cannot be assigned because shipment status is ${shipment.shipment_status}`
      );

    }


    // ==========================================
    // 3. Check Pickup Agent
    // ==========================================

    const pickupAgent =
      await pickupModel.findPickupAgentById(
        client,
        pickupAgentId
      );


    if (!pickupAgent) {

      throw new Error(
        "Pickup agent not found"
      );

    }


    // ==========================================
    // 4. Check Agent Status
    // ==========================================

    if (
      pickupAgent.status !== "ACTIVE"
    ) {

      throw new Error(
        "Pickup agent is not active"
      );

    }


    // ==========================================
    // 5. Check Existing Assignment
    // ==========================================

    const existingPickup =
      await pickupModel.findPickupByShipmentId(
        client,
        shipmentId
      );


    if (existingPickup) {

      throw new Error(
        "Pickup agent is already assigned to this shipment"
      );

    }


    // ==========================================
    // 6. Create Pickup
    // ==========================================

    const pickup =
      await pickupModel.createPickup(
        client,
        {
          shipment_id: shipmentId,

          pickup_agent_id: pickupAgentId,

          status: "ASSIGNED"
        }
      );


    // ==========================================
    // 7. Update Shipment Status
    // ==========================================

    await pickupModel.updateShipmentStatus(
      client,
      shipmentId,
      "PICKUP_PENDING"
    );


    // ==========================================
    // 8. Commit
    // ==========================================

    await client.query("COMMIT");


    return pickup;


  } catch (error) {

    await client.query("ROLLBACK");

    throw error;


  } finally {

    client.release();

  }

};

// ==========================================
// Get My Pickups
// ==========================================

const getMyPickups = async (
  agentId,
  status
) => {

  return await pickupModel.getMyPickups(
    agentId,
    status
  );

};

// ==========================================
// Accept Pickup
// ==========================================

const acceptPickup = async (
  shipmentId,
  agentId
) => {

  const client = await pool.connect();


  try {

    await client.query("BEGIN");


    const pickup = await pickupModel.acceptPickup(
      client,
      shipmentId,
      agentId
    );

    if (!pickup) {

      throw new Error(
        "Pickup not found, already accepted, or not assigned to this agent"
      );

    }


    // ==========================================
    // Update Shipment Status
    // ==========================================

    await pickupModel.updateShipmentStatus(
      client,
      shipmentId,
      "PICKUP_ACCEPTED"
    );


    await client.query("COMMIT");

    return pickup;


  } catch (error) {

    await client.query("ROLLBACK");

    throw error;


  } finally {

    client.release();

  }

};

// ==========================================
// Complete Pickup
// ==========================================

const completePickup = async (
    shipmentId,
    agentId
) => {

    const client = await pool.connect();


    try {

        await client.query("BEGIN");


        // ==========================================
        // 1. Check Shipment
        // ==========================================

        const shipment =
            await pickupModel.findShipmentById(
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
            shipment.shipment_status !== "PICKUP_ACCEPTED"
        ) {

            throw new Error(
                `Parcel cannot be picked up because shipment status is ${shipment.shipment_status}`
            );

        }


        // ==========================================
        // 3. Complete Pickup
        // ==========================================

        const pickup =
            await pickupModel.completePickup(
                client,
                shipmentId,
                agentId
            );


        if (!pickup) {

            throw new Error(
                "Pickup not found, already picked up, or not accepted by this agent"
            );

        }


        // ==========================================
        // 4. Update Shipment Status
        // ==========================================

        await pickupModel.updateShipmentStatus(
            client,
            shipmentId,
            "PICKED_UP"
        );


        // ==========================================
        // 5. Commit
        // ==========================================

        await client.query("COMMIT");


        return pickup;


    } catch (error) {

        await client.query("ROLLBACK");

        throw error;


    } finally {

        client.release();

    }

};


module.exports = {
  assignPickupAgent,
  getMyPickups,
  acceptPickup,
  completePickup
};