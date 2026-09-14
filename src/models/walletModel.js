const { pool } = require("../config/db");

// ==========================================
// Find Customer Wallet
// ==========================================

const findWalletByCustomerId = async (
  client,
  customerId
) => {

  const result = await client.query(
    `
    SELECT
      w.id,
      w.customer_id,
      w.balance,
      w.status,
      w.created_at,
      w.updated_at
    FROM wallets w
    WHERE w.customer_id = $1
    `,
    [customerId]
  );

  return result.rows[0];
};


// ==========================================
// Create Wallet
// ==========================================

const createWallet = async (
  client,
  customerId
) => {

  const result = await client.query(
    `
    INSERT INTO wallets
    (
      customer_id,
      balance,
      status
    )
    VALUES
    (
      $1,
      0,
      'ACTIVE'
    )
    RETURNING *
    `,
    [customerId]
  );

  return result.rows[0];
};


// ==========================================
// Get Wallet
// ==========================================

const getWallet = async (
  customerId
) => {

  const result = await pool.query(
    `
    SELECT
      id,
      customer_id,
      balance,
      status,
      created_at,
      updated_at
    FROM wallets
    WHERE customer_id = $1
    `,
    [customerId]
  );

  return result.rows[0];
};


// ==========================================
// Update Wallet Balance
// ==========================================

const updateBalance = async (
  client,
  walletId,
  newBalance
) => {

  const result = await client.query(
    `
    UPDATE wallets
    SET
      balance = $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
    `,
    [
      newBalance,
      walletId
    ]
  );

  return result.rows[0];
};


// ==========================================
// Create Wallet Transaction
// ==========================================

const createTransaction = async (
  client,
  transactionData
) => {

  const {
    wallet_id,
    customer_id,
    transaction_type,
    direction,
    amount,
    balance_after,
    shipment_id,
    reference,
    remark
  } = transactionData;

  const result = await client.query(
    `
    INSERT INTO wallet_transactions
    (
      wallet_id,
      customer_id,
      transaction_type,
      direction,
      amount,
      balance_after,
      shipment_id,
      reference,
      remark
    )
    VALUES
    (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $7,
      $8,
      $9
    )
    RETURNING *
    `,
    [
      wallet_id,
      customer_id,
      transaction_type,
      direction,
      amount,
      balance_after,
      shipment_id || null,
      reference || null,
      remark || null
    ]
  );

  return result.rows[0];
};


// ==========================================
// Get Wallet Transactions
// ==========================================

const getTransactions = async (
  customerId
) => {

  const result = await pool.query(
    `
    SELECT
      wt.*
    FROM wallet_transactions wt
    WHERE wt.customer_id = $1
    ORDER BY wt.created_at DESC
    `,
    [customerId]
  );

  return result.rows;
};


module.exports = {

  findWalletByCustomerId,
  createWallet,
  getWallet,
  updateBalance,
  createTransaction,
  getTransactions

};