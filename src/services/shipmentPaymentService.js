const { pool } = require("../config/db");

const shipmentPaymentModel =
  require("../models/shipmentPaymentModel");

const walletService =
  require("./walletService");


// ==========================================
// Create Shipment Payment
// ==========================================

const createShipmentPayment = async (
  customerId,
  data
) => {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    const shipment =
      await shipmentPaymentModel
        .findShipmentForPayment(
          client,
          data.shipment_id
        );

    if (!shipment) {

      throw new Error(
        "Shipment not found"
      );

    }

    if (
      shipment.customer_id !== customerId
    ) {

      throw new Error(
        "You are not allowed to pay for this shipment"
      );

    }

    if (
      Number(shipment.shipping_charge) <= 0
    ) {

      throw new Error(
        "Invalid shipment shipping charge"
      );

    }

    if (
      shipment.payment_status === "PAID"
    ) {

      throw new Error(
        "Shipment is already paid"
      );

    }

    const existingPayment =
      await shipmentPaymentModel
        .findShipmentPayment(
          client,
          data.shipment_id,
          customerId
        );

    if (
      existingPayment &&
      existingPayment.status === "SUCCESS"
    ) {

      throw new Error(
        "Shipment payment already completed"
      );

    }

    if (
      existingPayment &&
      existingPayment.status === "PENDING"
    ) {

      await client.query("COMMIT");

      return existingPayment;

    }

    const payment =
      await shipmentPaymentModel
        .createShipmentPayment(
          client,
          {
            customer_id: customerId,

            shipment_id:
              data.shipment_id,

            payment_method:
              data.payment_method,

            amount:
              Number(
                shipment.shipping_charge
              )
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
// Pay Shipment From Wallet
// ==========================================

const payShipmentFromWallet = async (
  customerId,
  paymentId
) => {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    // const payment =
    //   await shipmentPaymentModel
    //     .findShipmentPayment(
    //       client,
    //       paymentId,
    //       customerId
    //     );

    // IMPORTANT:
    // Above model searches shipment_id.
    // So payment lookup is handled separately below.

    const paymentResult =
      await client.query(
        `
        SELECT *
        FROM payments
        WHERE id = $1
          AND customer_id = $2
          AND payment_type = 'SHIPMENT_PAYMENT'
        FOR UPDATE
        `,
        [
          paymentId,
          customerId
        ]
      );

    const actualPayment =
      paymentResult.rows[0];

    if (!actualPayment) {

      throw new Error(
        "Shipment payment not found"
      );

    }

    if (
      actualPayment.status === "SUCCESS"
    ) {

      throw new Error(
        "Shipment payment already completed"
      );

    }

    if (
      actualPayment.status === "FAILED"
    ) {

      throw new Error(
        "Shipment payment has already failed"
      );

    }

    if (
      actualPayment.payment_method !==
      "WALLET"
    ) {

      throw new Error(
        "This payment is not a wallet payment"
      );

    }

    const shipment =
      await shipmentPaymentModel
        .findShipmentForPayment(
          client,
          actualPayment.shipment_id
        );

    if (!shipment) {

      throw new Error(
        "Shipment not found"
      );

    }

    if (
      shipment.customer_id !== customerId
    ) {

      throw new Error(
        "You are not allowed to pay for this shipment"
      );

    }

    if (
      shipment.payment_status === "PAID"
    ) {

      throw new Error(
        "Shipment is already paid"
      );

    }

    const amount =
      Number(actualPayment.amount);

    // ==========================================
    // Debit Wallet
    // ==========================================

    await walletService.debitWallet(
      client,

      customerId,

      amount,

      "SHIPMENT_PAYMENT",

      actualPayment.shipment_id,

      actualPayment.id,

      "Shipment payment successful"
    );

    // ==========================================
    // Payment Success
    // ==========================================

    const updatedPayment =
      await shipmentPaymentModel
        .updateShipmentPayment(
          client,
          paymentId,
          {
            status: "SUCCESS",

            gateway_payment_id:
              `WALLET_${paymentId}`,

            gateway_response: {
              method: "INTERNAL_WALLET",
              status: "SUCCESS"
            }
          }
        );

    // ==========================================
    // Shipment Paid
    // ==========================================

    await shipmentPaymentModel
      .markShipmentPaid(
        client,
        actualPayment.shipment_id
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
// Fail Shipment Payment
// ==========================================

const failShipmentPayment = async (
  customerId,
  paymentId,
  reason
) => {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    const result =
      await client.query(
        `
        SELECT *
        FROM payments
        WHERE id = $1
          AND customer_id = $2
          AND payment_type =
            'SHIPMENT_PAYMENT'
        FOR UPDATE
        `,
        [
          paymentId,
          customerId
        ]
      );

    const payment =
      result.rows[0];

    if (!payment) {

      throw new Error(
        "Shipment payment not found"
      );

    }

    if (
      payment.status === "SUCCESS"
    ) {

      throw new Error(
        "Successful payment cannot be failed"
      );

    }

    if (
      payment.status === "FAILED"
    ) {

      throw new Error(
        "Payment already failed"
      );

    }

    const failedPayment =
      await shipmentPaymentModel
        .updateShipmentPayment(
          client,
          paymentId,
          {
            status: "FAILED",

            gateway_response: {
              status: "FAILED",
              reason:
                reason ||
                "Payment failed"
            }
          }
        );

    await client.query("COMMIT");

    return failedPayment;

  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }

};


// ==========================================
// Get Shipment Payment
// ==========================================

const getShipmentPayment = async (
  customerId,
  shipmentId
) => {

  const payment =
    await shipmentPaymentModel
      .getShipmentPayment(
        shipmentId,
        customerId
      );

  if (!payment) {

    throw new Error(
      "Shipment payment not found"
    );

  }

  return payment;

};


// ==========================================
// Get All Shipment Payments
// ==========================================

const getAllShipmentPayments = async (
  page,
  limit
) => {

  return await shipmentPaymentModel
    .getAllShipmentPayments(
      page,
      limit
    );

};


module.exports = {

  createShipmentPayment,
  payShipmentFromWallet,
  failShipmentPayment,
  getShipmentPayment,
  getAllShipmentPayments

};