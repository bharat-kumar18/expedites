const paymentService =
  require("../services/paymentService");

const {
  validateRecharge
} = require("../validations/paymentValidation");


// ==========================================
// Create Recharge
// ==========================================

const createRecharge = async (
  req,
  res
) => {

  try {

    validateRecharge(req.body);

    const payment =
      await paymentService
        .createWalletRecharge(
          req.user.id,
          req.body
        );

    return res.status(201).json({

      success: true,

      message:
        "Wallet recharge payment created",

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
// Complete Recharge
// ==========================================

const completeRecharge = async (
  req,
  res
) => {

  try {

    const {
      payment_id,
      gateway_payment_id,
      gateway_response
    } = req.body;

    if (!payment_id) {

      throw new Error(
        "payment_id is required"
      );

    }

    const payment =
      await paymentService
        .completeWalletRecharge(
          req.user.id,
          payment_id,
          gateway_payment_id,
          gateway_response
        );

    return res.status(200).json({

      success: true,

      message:
        "Wallet recharge successful",

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
// Payment History
// ==========================================

const getPayments = async (
  req,
  res
) => {

  try {

    const payments =
      await paymentService
        .getCustomerPayments(
          req.user.id
        );

    return res.status(200).json({

      success: true,

      data: payments

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};
// ==========================================
// Admin - All Payments
// ==========================================

const getAllPayments = async (
  req,
  res
) => {

  try {

    const {
      page = 1,
      limit = 10,
      status,
      payment_type,
      payment_method,
      search
    } = req.body;


    const result =
      await paymentService.getAllPayments(
        Number(page),
        Number(limit),
        status,
        payment_type,
        payment_method,
        search
      );


    return res.status(200).json({

      success: true,

      message:
        "Payments fetched successfully",

      ...result

    });

  } catch (error) {

    console.error(
      "Get All Payments Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// Admin - Payment Report
// ==========================================

const getPaymentReport = async (
  req,
  res
) => {

  try {

    const report =
      await paymentService
        .getPaymentReport();

    return res.status(200).json({

      success: true,

      data: report

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


module.exports = {

  createRecharge,
  completeRecharge,
  getPayments,
  getAllPayments,
  getPaymentReport

};