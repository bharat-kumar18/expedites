const shipmentCostService =
  require("../services/shipmentCostService");


// ==========================================
// Calculate Shipment Cost
// ==========================================

const calculateShipmentCost = async (
  req,
  res
) => {

  try {

    const {
      shipment_id
    } = req.body;


    const cost =
      await shipmentCostService
        .calculateShipmentCost(
          shipment_id,
          req.body
        );


    return res.status(201).json({

      success: true,

      message:
        "Shipment cost calculated successfully",

      data: cost

    });


  } catch (error) {

    console.error(
      "Calculate Shipment Cost Error:",
      error
    );


    return res.status(400).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// Update Shipment Cost
// ==========================================

const updateShipmentCost = async (
  req,
  res
) => {

  try {

    const {
      shipment_id
    } = req.body;


    const cost =
      await shipmentCostService
        .updateShipmentCost(
          shipment_id,
          req.body
        );


    return res.status(200).json({

      success: true,

      message:
        "Shipment cost updated successfully",

      data: cost

    });


  } catch (error) {

    console.error(
      "Update Shipment Cost Error:",
      error
    );


    return res.status(400).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// Get Shipment Cost
// ==========================================

const getShipmentCost = async (
  req,
  res
) => {

  try {

    const {
      shipment_id
    } = req.body;


    const cost =
      await shipmentCostService
        .getShipmentCost(
          shipment_id
        );


    return res.status(200).json({

      success: true,

      message:
        "Shipment cost fetched successfully",

      data: cost

    });


  } catch (error) {

    console.error(
      "Get Shipment Cost Error:",
      error
    );


    return res.status(404).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// Get All Shipment Costs
// ==========================================

const getAllShipmentCosts = async (
  req,
  res
) => {

  try {

    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;


    const result =
      await shipmentCostService
        .getAllShipmentCosts(
          page,
          limit
        );


    return res.status(200).json({

      success: true,

      message:
        "Shipment costs fetched successfully",

      ...result

    });


  } catch (error) {

    console.error(
      "Get All Shipment Costs Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// Export
// ==========================================

module.exports = {

  calculateShipmentCost,

  updateShipmentCost,

  getShipmentCost,

  getAllShipmentCosts

};