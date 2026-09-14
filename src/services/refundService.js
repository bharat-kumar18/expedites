const { pool } =
  require("../config/db");

const refundModel =
  require("../models/refundModel");

const walletService =
  require("./walletService");


// ==========================================
// Create Refund
// ==========================================

const createRefund = async (
  customerId,
  data
) => {

  const client =
    await pool.connect();

  try {

    await client.query("BEGIN");

    const payment =
      await refundModel.findPayment(
        client,
        data.payment_id
      );

    if (!payment) {

      throw new Error(
        "Payment not found"
      );

    }

    if (
      payment.customer_id !== customerId
    ) {

      throw new Error(
        "You are not allowed to refund this payment"
      );

    }

    if (
      payment.status !== "SUCCESS"
    ) {

      throw new Error(
        "Only successful payments can be refunded"
      );

    }

    const existing =
      await refundModel.findRefundByPaymentId(
        client,
        data.payment_id
      );

    if (
      existing &&
      ["PENDING", "PROCESSING", "SUCCESS"]
        .includes(existing.status)
    ) {

      throw new Error(
        "Refund already exists for this payment"
      );

    }

    const paymentAmount =
      Number(payment.amount);

    const refundAmount =
      Number(
        data.refund_amount ??
        paymentAmount
      );

    if (
      refundAmount <= 0 ||
      refundAmount > paymentAmount
    ) {

      throw new Error(
        "Invalid refund amount"
      );

    }

    const refund =
      await refundModel.createRefund(
        client,
        {
          payment_id:
            payment.id,

          shipment_id:
            payment.shipment_id,

          customer_id:
            customerId,

          refund_amount:
            refundAmount,

          refund_reason:
            data.refund_reason ||
            null,

          refund_method:
            "WALLET"
        }
      );

    await client.query("COMMIT");

    return refund;

  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }

};


// ==========================================
// Process Wallet Refund
// ==========================================

const processWalletRefund = async (
  customerId,
  refundId
) => {

  const client =
    await pool.connect();

  try {

    await client.query("BEGIN");

    const result =
      await client.query(
        `
        SELECT *
        FROM refunds
        WHERE id = $1
          AND customer_id = $2
        FOR UPDATE
        `,
        [
          refundId,
          customerId
        ]
      );

    const refund =
      result.rows[0];

    if (!refund) {

      throw new Error(
        "Refund not found"
      );

    }

    if (
      refund.status === "SUCCESS"
    ) {

      throw new Error(
        "Refund already completed"
      );

    }

    if (
      refund.status === "PROCESSING"
    ) {

      throw new Error(
        "Refund is already processing"
      );

    }

    await refundModel.updateRefund(
      client,
      refundId,
      {
        status: "PROCESSING"
      }
    );

    await walletService.creditWallet(
      client,

      customerId,

      refund.refund_amount,

      "REFUND",

      refund.id,

      refund.refund_reason ||
        "Payment refund"
    );

    const updatedRefund =
      await refundModel.updateRefund(
        client,
        refundId,
        {
          status: "SUCCESS",

          gateway_refund_id:
            `MOCK_REFUND_${refund.id}`,

          gateway_response: {
            mode: "MOCK",
            status: "SUCCESS"
          }
        }
      );

    await client.query("COMMIT");

    return updatedRefund;

  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }

};


// ==========================================
// Customer Refund History
// ==========================================

const getCustomerRefunds = async (
  customerId
) => {

  return refundModel.getCustomerRefunds(
    customerId
  );

};


// ==========================================
// Admin Refund List
// ==========================================

const getAllRefunds = async (
  page,
  limit
) => {

  return refundModel.getAllRefunds(
    page,
    limit
  );

};


module.exports = {

  createRefund,
  processWalletRefund,
  getCustomerRefunds,
  getAllRefunds

};