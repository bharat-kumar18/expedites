const { pool } = require("../config/db");

const paymentModel =
  require("../models/paymentModel");

const walletService =
  require("./walletService");


// ==========================================
// Create Wallet Recharge
// ==========================================

const createWalletRecharge = async (
  customerId,
  data
) => {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    const amount =
      Number(data.amount);

    if (amount <= 0) {

      throw new Error(
        "Amount must be greater than 0"
      );

    }

    const payment =
      await paymentModel.createPayment(
        client,
        {
          customer_id: customerId,

          payment_type:
            "WALLET_RECHARGE",

          payment_method:
            data.payment_method,

          amount,

          status: "PENDING",

          gateway:
            "MOCK_GATEWAY"
        }
      );

    await client.query("COMMIT");

    return payment;

  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }

};


// ==========================================
// Complete Wallet Recharge
// ==========================================

const completeWalletRecharge = async (
  customerId,
  paymentId,
  gatewayPaymentId,
  gatewayResponse
) => {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    const payment =
      await paymentModel.findPaymentByIdAndCustomer(
        client,
        paymentId,
        customerId
      );

    if (!payment) {

      throw new Error(
        "Payment not found"
      );

    }

    if (
      payment.payment_type !==
      "WALLET_RECHARGE"
    ) {

      throw new Error(
        "Invalid payment type"
      );

    }

    if (payment.status === "SUCCESS") {

      throw new Error(
        "Payment already completed"
      );

    }

    if (payment.status === "FAILED") {

      throw new Error(
        "Payment has already failed"
      );

    }

    const updatedPayment =
      await paymentModel.updatePayment(
        client,
        paymentId,
        {
          status: "SUCCESS",

          gateway_payment_id:
            gatewayPaymentId,

          gateway_response:
            gatewayResponse
        }
      );

    await walletService.creditWallet(
      client,

      payment.customer_id,

      payment.amount,

      "RECHARGE",

      gatewayPaymentId || payment.id,

      "Wallet recharge successful"
    );

    await client.query("COMMIT");

    return updatedPayment;

  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }

};


// ==========================================
// Get Payment History
// ==========================================

const getCustomerPayments = async (
  customerId
) => {

  return await paymentModel
    .getCustomerPayments(
      customerId
    );

};

// ==========================================
// Admin - All Payments
// ==========================================

const getAllPayments = async (
  page,
  limit
) => {

  return paymentModel.getAllPayments(
    page,
    limit
  );

};


// ==========================================
// Admin - Payment Report
// ==========================================

const getPaymentReport = async () => {

  return paymentModel.getPaymentReport();

};


module.exports = {

  createWalletRecharge,
  completeWalletRecharge,
  getCustomerPayments,
  getAllPayments,
  getPaymentReport

};