const { pool } = require("../config/db");


// ==========================================
// Create Shipment
// ==========================================

const createShipment = async (client, data) => {

  const result = await client.query(
    `
    INSERT INTO shipments (

      tracking_number,
      customer_id,

      pickup_name,
      pickup_phone,
      pickup_address,
      pickup_pincode,
      pickup_hub_id,

      receiver_name,
      receiver_phone,
      receiver_address,
      delivery_pincode,
      delivery_hub_id,

      current_hub_id,

      package_type,
      package_weight,
      package_length,
      package_width,
      package_height,

      shipping_charge,
      payment_status,
      shipment_status

    )

    VALUES (

      $1,
      $2,

      $3,
      $4,
      $5,
      $6,
      $7,

      $8,
      $9,
      $10,
      $11,
      $12,

      $13,

      $14,
      $15,
      $16,
      $17,
      $18,

      $19,
      $20,
      $21

    )

    RETURNING *
    `,

    [

      // ==========================================
      // Tracking + Customer
      // ==========================================

      data.tracking_number,
      data.customer_id,


      // ==========================================
      // Pickup
      // ==========================================

      data.pickup_name,
      data.pickup_phone,
      data.pickup_address,
      data.pickup_pincode,
      data.pickup_hub_id,


      // ==========================================
      // Receiver
      // ==========================================

      data.receiver_name,
      data.receiver_phone,
      data.receiver_address,
      data.delivery_pincode,
      data.delivery_hub_id,


      // ==========================================
      // Current Hub
      // ==========================================

      data.current_hub_id,


      // ==========================================
      // Package
      // ==========================================

      data.package_type,
      data.package_weight,
      data.package_length,
      data.package_width,
      data.package_height,


      // ==========================================
      // Payment + Shipment Status
      // ==========================================

      data.shipping_charge,
      data.payment_status,
      data.shipment_status

    ]

  );


  return result.rows[0];

};


// ==========================================
// Export
// ==========================================

module.exports = {
  createShipment
};