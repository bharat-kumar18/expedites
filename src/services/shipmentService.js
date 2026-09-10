const shipmentModel = require("../models/shipmentModel");
const { pool } = require("../config/db");


// ==========================================
// Generate Tracking Number
// ==========================================

const generateTrackingNumber = () => {

  const random = Math.floor(
    100000 + Math.random() * 900000
  );

  return `EXP${Date.now()}${random}`;

};


// ==========================================
// Create Shipment
// ==========================================

const createShipment = async (customerId, data) => {

  const client = await pool.connect();

  try {

    // Start transaction
    await client.query("BEGIN");


    // ==========================================
    // 1. Find Pickup Pincode + Hub
    // ==========================================

    const pickupResult = await client.query(
      `
      SELECT
        p.id AS pincode_id,
        p.pincode,
        p.hub_id,
        h.name AS hub_name

      FROM pincodes p

      JOIN hubs h
        ON p.hub_id = h.id

      WHERE p.pincode = $1
        AND p.status = 'ACTIVE'
      `,
      [data.pickup_pincode]
    );


    if (pickupResult.rows.length === 0) {

      throw new Error(
        "Pickup pincode is not serviceable"
      );

    }


    // ==========================================
    // 2. Find Delivery Pincode + Hub
    // ==========================================

    const deliveryResult = await client.query(
      `
      SELECT
        p.id AS pincode_id,
        p.pincode,
        p.hub_id,
        h.name AS hub_name

      FROM pincodes p

      JOIN hubs h
        ON p.hub_id = h.id

      WHERE p.pincode = $1
        AND p.status = 'ACTIVE'
      `,
      [data.delivery_pincode]
    );


    if (deliveryResult.rows.length === 0) {

      throw new Error(
        "Delivery pincode is not serviceable"
      );

    }


    // ==========================================
    // 3. Get Hub IDs
    // ==========================================

    const pickupHubId =
      pickupResult.rows[0].hub_id;

    const deliveryHubId =
      deliveryResult.rows[0].hub_id;


    // ==========================================
    // 4. Generate Tracking Number
    // ==========================================

    const trackingNumber =
      generateTrackingNumber();


    console.log(
      "Generated Tracking Number:",
      trackingNumber
    );


    // ==========================================
    // 5. Prepare Shipment Data
    // ==========================================

    const shipmentData = {

      tracking_number: trackingNumber,

      customer_id: customerId,


      // ==========================================
      // Pickup
      // ==========================================

      pickup_name: data.pickup_name,

      pickup_phone: data.pickup_phone,

      pickup_address: data.pickup_address,

      pickup_pincode: data.pickup_pincode,

      pickup_hub_id: pickupHubId,


      // ==========================================
      // Receiver
      // ==========================================

      receiver_name: data.receiver_name,

      receiver_phone: data.receiver_phone,

      receiver_address: data.receiver_address,

      delivery_pincode: data.delivery_pincode,

      delivery_hub_id: deliveryHubId,


      // ==========================================
      // Current Hub
      // ==========================================

      // Initially shipment is at pickup hub
      current_hub_id: pickupHubId,


      // ==========================================
      // Package
      // ==========================================

      package_type: data.package_type,

      package_weight: data.package_weight,

      package_length:
        data.package_length || null,

      package_width:
        data.package_width || null,

      package_height:
        data.package_height || null,


      // ==========================================
      // Payment
      // ==========================================

      shipping_charge:
        data.shipping_charge || 0,

      payment_status: "PENDING",


      // ==========================================
      // Shipment
      // ==========================================

      shipment_status: "BOOKED"

    };


    // ==========================================
    // 6. Create Shipment
    // ==========================================

    const shipment =
      await shipmentModel.createShipment(
        client,
        shipmentData
      );


    // ==========================================
    // 7. Commit
    // ==========================================

    await client.query("COMMIT");


    return shipment;


  } catch (error) {

    // Rollback
    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }

};


// ==========================================
// Export
// ==========================================

module.exports = {
  createShipment
};