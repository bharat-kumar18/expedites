// ==========================================
// Validate Delivery Assignment
// ==========================================

const validateAssignDelivery = (
  req,
  res,
  next
) => {

  const {
    shipment_id,
    delivery_agent_id
  } = req.body || {};


  // ==========================================
  // Required Fields
  // ==========================================

  if (
    !shipment_id ||
    !delivery_agent_id
  ) {

    return res.status(400).json({

      success: false,

      message:
        "shipment_id and delivery_agent_id are required"

    });

  }


  next();

};


// ==========================================
// Validate Shipment ID
// ==========================================

const validateShipmentId = (
  req,
  res,
  next
) => {

  const {
    shipment_id
  } = req.body || {};


  if (!shipment_id) {

    return res.status(400).json({

      success: false,

      message:
        "shipment_id is required"

    });

  }


  next();

};


// ==========================================
// Validate My Deliveries
// ==========================================

const validateMyDeliveries = (
  req,
  res,
  next
) => {

  const {
    status
  } = req.body || {};


  // Status is optional

  if (!status) {

    return next();

  }


  const allowedStatuses = [

    "ASSIGNED",

    "ACCEPTED",

    "OUT_FOR_DELIVERY",

    "DELIVERED",

    "FAILED",

    "CANCELLED"

  ];


  if (
    !allowedStatuses.includes(status)
  ) {

    return res.status(400).json({

      success: false,

      message:
        "Invalid delivery status"

    });

  }


  next();

};


// ==========================================
// Validate Complete Delivery
// ==========================================

const validateCompleteDelivery = (
  req,
  res,
  next
) => {

  const {
    shipment_id
  } = req.body || {};


  if (!shipment_id) {

    return res.status(400).json({

      success: false,

      message:
        "shipment_id is required"

    });

  }


  next();

};


// ==========================================
// Validate Failed Delivery
// ==========================================

const validateFailedDelivery = (
  req,
  res,
  next
) => {

  const {
    shipment_id,
    failure_reason
  } = req.body || {};


  if (!shipment_id) {

    return res.status(400).json({

      success: false,

      message:
        "shipment_id is required"

    });

  }


  if (!failure_reason) {

    return res.status(400).json({

      success: false,

      message:
        "failure_reason is required"

    });

  }


  next();

};


// ==========================================
// Export
// ==========================================

module.exports = {

  validateAssignDelivery,

  validateShipmentId,

  validateMyDeliveries,

  validateCompleteDelivery,

  validateFailedDelivery

};