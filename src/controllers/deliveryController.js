const deliveryService =
  require("../services/deliveryService");


// ==========================================
// Assign Delivery Agent
// ==========================================

const assignDeliveryAgent = async (
  req,
  res
) => {

  try {

    const {
      shipment_id,
      delivery_agent_id
    } = req.body;


    const delivery =
      await deliveryService.assignDeliveryAgent(
        shipment_id,
        delivery_agent_id
      );


    return res.status(201).json({

      success: true,

      message:
        "Delivery agent assigned successfully",

      data: delivery

    });


  } catch (error) {

    console.error(
      "Assign delivery agent error:",
      error.message
    );


    return res.status(400).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// Get My Deliveries
// ==========================================

const getMyDeliveries = async (
  req,
  res
) => {

  try {

    // Agent ID comes from JWT

    const agentId =
      req.user.id;


    const {
      status
    } = req.body || {};


    const deliveries =
      await deliveryService.getMyDeliveries(
        agentId,
        status
      );


    return res.status(200).json({

      success: true,

      message:
        "Deliveries fetched successfully",

      count:
        deliveries.length,

      data:
        deliveries

    });


  } catch (error) {

    console.error(
      "Get my deliveries error:",
      error.message
    );


    return res.status(400).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// Accept Delivery
// ==========================================

const acceptDelivery = async (
  req,
  res
) => {

  try {

    const {
      shipment_id
    } = req.body;


    const agentId =
      req.user.id;


    const delivery =
      await deliveryService.acceptDelivery(
        shipment_id,
        agentId
      );


    return res.status(200).json({

      success: true,

      message:
        "Delivery accepted successfully",

      data:
        delivery

    });


  } catch (error) {

    console.error(
      "Accept delivery error:",
      error.message
    );


    return res.status(400).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// Start Delivery
// ==========================================

const startDelivery = async (
  req,
  res
) => {

  try {

    const {
      shipment_id
    } = req.body;


    const agentId =
      req.user.id;


    const delivery =
      await deliveryService.startDelivery(
        shipment_id,
        agentId
      );


    return res.status(200).json({

      success: true,

      message:
        "Shipment is now out for delivery",

      data:
        delivery

    });


  } catch (error) {

    console.error(
      "Start delivery error:",
      error.message
    );


    return res.status(400).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// Complete Delivery
// ==========================================

const completeDelivery = async (
  req,
  res
) => {

  try {

    const {
      shipment_id,
      remark
    } = req.body;


    const agentId =
      req.user.id;


    const delivery =
      await deliveryService.completeDelivery(
        shipment_id,
        agentId,
        remark
      );


    return res.status(200).json({

      success: true,

      message:
        "Shipment delivered successfully",

      data:
        delivery

    });


  } catch (error) {

    console.error(
      "Complete delivery error:",
      error.message
    );


    return res.status(400).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// Fail Delivery
// ==========================================

const failDelivery = async (
  req,
  res
) => {

  try {

    const {
      shipment_id,
      failure_reason,
      remark
    } = req.body;


    const agentId =
      req.user.id;


    const delivery =
      await deliveryService.failDelivery(
        shipment_id,
        agentId,
        failure_reason,
        remark
      );


    return res.status(200).json({

      success: true,

      message:
        "Delivery marked as failed",

      data:
        delivery

    });


  } catch (error) {

    console.error(
      "Fail delivery error:",
      error.message
    );


    return res.status(400).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// Get Delivery By Shipment
// ==========================================

const getDeliveryByShipmentId = async (
  req,
  res
) => {

  try {

    const {
      shipment_id
    } = req.body;


    if (!shipment_id) {

      return res.status(400).json({

        success: false,

        message:
          "shipment_id is required"

      });

    }


    const delivery =
      await deliveryService
        .getDeliveryByShipmentId(
          shipment_id
        );


    return res.status(200).json({

      success: true,

      message:
        "Delivery fetched successfully",

      data:
        delivery

    });


  } catch (error) {

    console.error(
      "Get delivery error:",
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

  assignDeliveryAgent,

  getMyDeliveries,

  acceptDelivery,

  startDelivery,

  completeDelivery,

  failDelivery,

  getDeliveryByShipmentId

};