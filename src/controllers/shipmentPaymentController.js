const shipmentPaymentService =
  require("../services/shipmentPaymentService");


// ==========================================
// Create Shipment Payment
// ==========================================

const createShipmentPayment = async (
  req,
  res
) => {

  try {

    const payment =
      await shipmentPaymentService
        .createShipmentPayment(
          req.user.id,
          req.body
        );

    return res.status(201).json({

      success: true,

      message:
        "Shipment payment created successfully",

      data: payment

    });

  } catch (error) {

    return res.status(400).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// Pay From Wallet
// ==========================================

const payShipmentFromWallet = async (
  req,
  res
) => {

  try {

    const {
      payment_id
    } = req.body;

    const payment =
      await shipmentPaymentService
        .payShipmentFromWallet(
          req.user.id,
          payment_id
        );

    return res.status(200).json({

      success: true,

      message:
        "Shipment payment successful",

      data: payment

    });

  } catch (error) {

    return res.status(400).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// Fail Payment
// ==========================================

const failShipmentPayment = async (
  req,
  res
) => {

  try {

    const {
      payment_id,
      reason
    } = req.body;

    const payment =
      await shipmentPaymentService
        .failShipmentPayment(
          req.user.id,
          payment_id,
          reason
        );

    return res.status(200).json({

      success: true,

      message:
        "Shipment payment marked as failed",

      data: payment

    });

  } catch (error) {

    return res.status(400).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// Get Payment
// ==========================================

const getShipmentPayment = async (
  req,
  res
) => {

  try {

    const payment =
      await shipmentPaymentService
        .getShipmentPayment(
          req.user.id,
          req.body.shipment_id
        );

    return res.status(200).json({

      success: true,

      data: payment

    });

  } catch (error) {

    return res.status(404).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// Get All Payments
// ==========================================

const getAllShipmentPayments = async (
  req,
  res
) => {

  try {

    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    const result =
      await shipmentPaymentService
        .getAllShipmentPayments(
          page,
          limit
        );

    return res.status(200).json({

      success: true,

      message:
        "Shipment payments fetched successfully",

      ...result

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


module.exports = {

  createShipmentPayment,
  payShipmentFromWallet,
  failShipmentPayment,
  getShipmentPayment,
  getAllShipmentPayments

};