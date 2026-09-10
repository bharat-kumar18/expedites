// ==========================================
// Validate Create Movement
// ==========================================

const validateCreateMovement = (
  req,
  res,
  next
) => {

  const {
    shipment_id,
    to_hub_id
  } = req.body || {};


  if (!shipment_id) {

    return res.status(400).json({

      success: false,

      message:
        "shipment_id is required"

    });

  }


  if (!to_hub_id) {

    return res.status(400).json({

      success: false,

      message:
        "to_hub_id is required"

    });

  }


  next();

};


// ==========================================
// Validate Shipment Movement List
// ==========================================

const validateShipmentMovement = (
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
// Export
// ==========================================

module.exports = {

  validateCreateMovement,

  validateShipmentMovement

};