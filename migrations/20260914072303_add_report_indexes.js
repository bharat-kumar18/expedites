/**
 * Add indexes required for Reports Module
 */

exports.up = async function (knex) {

  // ==========================================
  // Shipments
  // ==========================================

  await knex.schema.alterTable(
    "shipments",
    (table) => {

      table.index(
        ["shipment_status"],
        "idx_shipments_status"
      );

      table.index(
        ["customer_id"],
        "idx_shipments_customer"
      );

      table.index(
        ["created_at"],
        "idx_shipments_created_at"
      );

      table.index(
        ["pickup_hub_id"],
        "idx_shipments_pickup_hub"
      );

      table.index(
        ["delivery_hub_id"],
        "idx_shipments_delivery_hub"
      );

    }
  );


  // ==========================================
  // Payments
  // ==========================================

  await knex.schema.alterTable(
    "payments",
    (table) => {

      table.index(
        ["status"],
        "idx_payments_status"
      );

      table.index(
        ["payment_type"],
        "idx_payments_type"
      );

      table.index(
        ["created_at"],
        "idx_payments_created_at"
      );

      table.index(
        ["customer_id"],
        "idx_payments_customer"
      );

    }
  );


  // ==========================================
  // COD
  // ==========================================

  await knex.schema.alterTable(
    "cod_payments",
    (table) => {

      table.index(
        ["collection_status"],
        "idx_cod_collection_status"
      );

      table.index(
        ["settlement_status"],
        "idx_cod_settlement_status"
      );

      table.index(
        ["created_at"],
        "idx_cod_created_at"
      );

      table.index(
        ["seller_id"],
        "idx_cod_seller"
      );

    }
  );


  // ==========================================
  // Wallet Transactions
  // ==========================================

  await knex.schema.alterTable(
    "wallet_transactions",
    (table) => {

      table.index(
        ["created_at"],
        "idx_wallet_transactions_created_at"
      );

      table.index(
        ["wallet_id"],
        "idx_wallet_transactions_wallet"
      );

    }
  );


  // ==========================================
  // Complaints
  // ==========================================

  await knex.schema.alterTable(
    "complaints",
    (table) => {

      table.index(
        ["status"],
        "idx_complaints_status"
      );

      table.index(
        ["priority"],
        "idx_complaints_priority"
      );

      table.index(
        ["category"],
        "idx_complaints_category"
      );

      table.index(
        ["created_at"],
        "idx_complaints_created_at"
      );

      table.index(
        ["customer_id"],
        "idx_complaints_customer"
      );

      table.index(
        ["assigned_to"],
        "idx_complaints_assigned"
      );

    }
  );

};


// ==========================================
// Rollback
// ==========================================

exports.down = async function (knex) {

  await knex.schema.alterTable(
    "shipments",
    (table) => {

      table.dropIndex(
        ["shipment_status"],
        "idx_shipments_status"
      );

      table.dropIndex(
        ["customer_id"],
        "idx_shipments_customer"
      );

      table.dropIndex(
        ["created_at"],
        "idx_shipments_created_at"
      );

      table.dropIndex(
        ["pickup_hub_id"],
        "idx_shipments_pickup_hub"
      );

      table.dropIndex(
        ["delivery_hub_id"],
        "idx_shipments_delivery_hub"
      );

    }
  );


  await knex.schema.alterTable(
    "payments",
    (table) => {

      table.dropIndex(
        ["status"],
        "idx_payments_status"
      );

      table.dropIndex(
        ["payment_type"],
        "idx_payments_type"
      );

      table.dropIndex(
        ["created_at"],
        "idx_payments_created_at"
      );

      table.dropIndex(
        ["customer_id"],
        "idx_payments_customer"
      );

    }
  );


  await knex.schema.alterTable(
    "cod_payments",
    (table) => {

      table.dropIndex(
        ["collection_status"],
        "idx_cod_collection_status"
      );

      table.dropIndex(
        ["settlement_status"],
        "idx_cod_settlement_status"
      );

      table.dropIndex(
        ["created_at"],
        "idx_cod_created_at"
      );

      table.dropIndex(
        ["seller_id"],
        "idx_cod_seller"
      );

    }
  );


  await knex.schema.alterTable(
    "wallet_transactions",
    (table) => {

      table.dropIndex(
        ["created_at"],
        "idx_wallet_transactions_created_at"
      );

      table.dropIndex(
        ["wallet_id"],
        "idx_wallet_transactions_wallet"
      );

    }
  );


  await knex.schema.alterTable(
    "complaints",
    (table) => {

      table.dropIndex(
        ["status"],
        "idx_complaints_status"
      );

      table.dropIndex(
        ["priority"],
        "idx_complaints_priority"
      );

      table.dropIndex(
        ["category"],
        "idx_complaints_category"
      );

      table.dropIndex(
        ["created_at"],
        "idx_complaints_created_at"
      );

      table.dropIndex(
        ["customer_id"],
        "idx_complaints_customer"
      );

      table.dropIndex(
        ["assigned_to"],
        "idx_complaints_assigned"
      );

    }
  );

};