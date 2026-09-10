const shipmentMovementService =
  require("../services/shipmentMovementService");


// ==========================================
// Move Shipment To Hub
// ==========================================

const createMovement = async (
  req,
  res
) => {

  try {

    const {
      shipment_id,
      to_hub_id,
      remark
    } = req.body;


    const movement =
      await shipmentMovementService.createMovement(
        shipment_id,
        to_hub_id,
        remark
      );


    return res.status(201).json({

      success: true,

      message:
        "Shipment moved to hub successfully",

      data: movement

    });


  } catch (error) {

    console.error(
      "Create shipment movement error:",
      error.message
    );


    return res.status(400).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// Get Shipment Movement History
// ==========================================

const getShipmentMovements = async (
  req,
  res
) => {

  try {

    const {
      shipment_id
    } = req.body;


    const movements =
      await shipmentMovementService
        .getShipmentMovements(
          shipment_id
        );


    return res.status(200).json({

      success: true,

      message:
        "Shipment movement history fetched successfully",

      count: movements.length,

      data: movements

    });


  } catch (error) {

    console.error(
      "Get shipment movement error:",
      error.message
    );


    return res.status(400).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// Export
// ==========================================

module.exports = {

  createMovement,

  getShipmentMovements

};