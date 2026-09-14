const refundService =
  require("../services/refundService");


// ==========================================
// Create Refund
// ==========================================

const createRefund = async (
  req,
  res
) => {

  try {

    const refund =
      await refundService.createRefund(
        req.user.id,
        req.body
      );

    return res.status(201).json({

      success: true,

      message:
        "Refund request created successfully",

      data: refund

    });

  } catch (error) {

    return res.status(400).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// Process Wallet Refund
// ==========================================

const processWalletRefund = async (
  req,
  res
) => {

  try {

    const {
      refund_id
    } = req.body;

    if (!refund_id) {

      throw new Error(
        "refund_id is required"
      );

    }

    const refund =
      await refundService
        .processWalletRefund(
          req.user.id,
          refund_id
        );

    return res.status(200).json({

      success: true,

      message:
        "Refund processed successfully",

      data: refund

    });

  } catch (error) {

    return res.status(400).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// My Refunds
// ==========================================

const getCustomerRefunds = async (
  req,
  res
) => {

  try {

    const refunds =
      await refundService
        .getCustomerRefunds(
          req.user.id
        );

    return res.status(200).json({

      success: true,

      data: refunds

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// Admin Refunds
// ==========================================

const getAllRefunds = async (
  req,
  res
) => {

  try {

    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    const result =
      await refundService.getAllRefunds(
        page,
        limit
      );

    return res.status(200).json({

      success: true,

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

  createRefund,
  processWalletRefund,
  getCustomerRefunds,
  getAllRefunds

};