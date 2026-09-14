const { pool } = require("../config/db");

const walletModel =
  require("../models/walletModel");


// ==========================================
// Get Or Create Wallet
// ==========================================

const getOrCreateWallet = async (
  customerId
) => {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    let wallet =
      await walletModel.findWalletByCustomerId(
        client,
        customerId
      );

    if (!wallet) {

      wallet =
        await walletModel.createWallet(
          client,
          customerId
        );

    }

    await client.query("COMMIT");

    return wallet;

  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }

};


// ==========================================
// Get Wallet
// ==========================================

const getWallet = async (
  customerId
) => {

  return await walletModel.getWallet(
    customerId
  );

};


// ==========================================
// Get Transactions
// ==========================================

const getTransactions = async (
  customerId
) => {

  return await walletModel.getTransactions(
    customerId
  );

};


// ==========================================
// Credit Wallet
// ==========================================

const creditWallet = async (
  client,
  customerId,
  amount,
  transactionType,
  reference,
  remark
) => {

  let wallet =
    await walletModel.findWalletByCustomerId(
      client,
      customerId
    );

  if (!wallet) {

    wallet =
      await walletModel.createWallet(
        client,
        customerId
      );

  }

  if (wallet.status !== "ACTIVE") {

    throw new Error(
      "Wallet is not active"
    );

  }

  const currentBalance =
    Number(wallet.balance);

  const creditAmount =
    Number(amount);

  if (creditAmount <= 0) {

    throw new Error(
      "Amount must be greater than 0"
    );

  }

  const newBalance =
    currentBalance + creditAmount;


  await walletModel.updateBalance(
    client,
    wallet.id,
    newBalance
  );


  const transaction =
    await walletModel.createTransaction(
      client,
      {
        wallet_id: wallet.id,
        customer_id: customerId,
        transaction_type: transactionType,
        direction: "CREDIT",
        amount: creditAmount,
        balance_after: newBalance,
        reference,
        remark
      }
    );


  return transaction;

};


// ==========================================
// Debit Wallet
// ==========================================

const debitWallet = async (
  client,
  customerId,
  amount,
  transactionType,
  shipmentId,
  reference,
  remark
) => {

  const wallet =
    await walletModel.findWalletByCustomerId(
      client,
      customerId
    );

  if (!wallet) {

    throw new Error(
      "Wallet not found"
    );

  }

  if (wallet.status !== "ACTIVE") {

    throw new Error(
      "Wallet is not active"
    );

  }


  const currentBalance =
    Number(wallet.balance);

  const debitAmount =
    Number(amount);


  if (debitAmount <= 0) {

    throw new Error(
      "Amount must be greater than 0"
    );

  }


  if (currentBalance < debitAmount) {

    throw new Error(
      "Insufficient wallet balance"
    );

  }


  const newBalance =
    currentBalance - debitAmount;


  await walletModel.updateBalance(
    client,
    wallet.id,
    newBalance
  );


  const transaction =
    await walletModel.createTransaction(
      client,
      {
        wallet_id: wallet.id,
        customer_id: customerId,
        transaction_type: transactionType,
        direction: "DEBIT",
        amount: debitAmount,
        balance_after: newBalance,
        shipment_id: shipmentId,
        reference,
        remark
      }
    );


  return transaction;

};


module.exports = {

  getOrCreateWallet,
  getWallet,
  getTransactions,
  creditWallet,
  debitWallet

};