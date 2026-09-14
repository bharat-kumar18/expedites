// ==========================================
// Shipment Status Constants
// ==========================================

const SHIPMENT_STATUSES = [
  "BOOKED",
  "PICKUP_PENDING",
  "PICKUP_ACCEPTED",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURNED"
];


// ==========================================
// Active Shipment Statuses
// ==========================================

const ACTIVE_SHIPMENT_STATUSES = [
  "BOOKED",
  "PICKUP_PENDING",
  "PICKUP_ACCEPTED",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY"
];


// ==========================================
// Final Shipment Statuses
// ==========================================

const FINAL_SHIPMENT_STATUSES = [
  "DELIVERED",
  "CANCELLED",
  "RETURNED"
];


module.exports = {
  SHIPMENT_STATUSES,
  ACTIVE_SHIPMENT_STATUSES,
  FINAL_SHIPMENT_STATUSES
};