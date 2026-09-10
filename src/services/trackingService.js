const trackingModel =
  require("../models/trackingModel");


// ==========================================
// Track Shipment
// ==========================================

const trackShipment = async (
  trackingNumber
) => {

  // ==========================================
  // 1. Find Shipment
  // ==========================================

  const shipment =
    await trackingModel.findShipmentByTrackingNumber(
      trackingNumber
    );


  if (!shipment) {

    throw new Error(
      "Shipment not found"
    );

  }


  // ==========================================
  // 2. Get Hub Movement History
  // ==========================================

  const movements =
    await trackingModel.getHubMovements(
      shipment.id
    );


  // ==========================================
  // 3. Get Pickup Information
  // ==========================================

  const pickup =
    await trackingModel.getPickupInformation(
      shipment.id
    );


  // ==========================================
  // 4. Get Delivery Information
  // ==========================================

  const delivery =
    await trackingModel.getDeliveryInformation(
      shipment.id
    );


  // ==========================================
  // 5. Return Complete Tracking
  // ==========================================

  return {

    shipment: {

      id: shipment.id,

      tracking_number:
        shipment.tracking_number,

      shipment_status:
        shipment.shipment_status,

      payment_status:
        shipment.payment_status,

      created_at:
        shipment.created_at,

      updated_at:
        shipment.updated_at

    },


    pickup: {

      name:
        shipment.pickup_name,

      phone:
        shipment.pickup_phone,

      address:
        shipment.pickup_address,

      pincode:
        shipment.pickup_pincode,

      hub: {

        id:
          shipment.pickup_hub_id,

        name:
          shipment.pickup_hub_name,

        city_id:
          shipment.pickup_city_id

      },

      assignment:
        pickup || null

    },


    delivery: {

      receiver_name:
        shipment.receiver_name,

      receiver_phone:
        shipment.receiver_phone,

      address:
        shipment.receiver_address,

      pincode:
        shipment.delivery_pincode,

      hub: {

        id:
          shipment.delivery_hub_id,

        name:
          shipment.delivery_hub_name,

        city_id:
          shipment.delivery_city_id

      },

      assignment:
        delivery || null

    },


    current_location: {

      hub_id:
        shipment.current_hub_id || null,

      hub_name:
        shipment.current_hub_name || null,

      city_id:
        shipment.current_city_id || null

    },


    movements

  };

};


// ==========================================
// Export
// ==========================================

module.exports = {

  trackShipment

};