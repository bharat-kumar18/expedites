/**
 * Create Wallet Transactions Table
 *
 * Maintains complete wallet ledger.
 */

exports.up = function (knex) {
  return knex.schema.createTable(
    "wallet_transactions",
    function (table) {

      // ==========================================
      // PRIMARY KEY
      // ==========================================

      table
        .uuid("id")
        .primary()
        .defaultTo(
          knex.raw("gen_random_uuid()")
        );


      // ==========================================
      // WALLET
      // ==========================================

      table
        .uuid("wallet_id")
        .notNullable()
        .references("id")
        .inTable("wallets")
        .onDelete("RESTRICT")
        .onUpdate("CASCADE");


      // ==========================================
      // CUSTOMER
      // ==========================================

      table
        .uuid("customer_id")
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("RESTRICT")
        .onUpdate("CASCADE");


      // ==========================================
      // TRANSACTION TYPE
      // ==========================================

      table
        .enu(
          "transaction_type",
          [
            "RECHARGE",
            "SHIPMENT_PAYMENT",
            "REFUND",
            "ADJUSTMENT",
            "COD_CREDIT"
          ],
          {
            useNative: true,
            enumName: "wallet_transaction_type"
          }
        )
        .notNullable();


      // ==========================================
      // TRANSACTION DIRECTION
      // ==========================================

      table
        .enu(
          "direction",
          [
            "CREDIT",
            "DEBIT"
          ],
          {
            useNative: true,
            enumName: "wallet_transaction_direction"
          }
        )
        .notNullable();


      // ==========================================
      // AMOUNT
      // ==========================================

      table
        .decimal("amount", 12, 2)
        .notNullable();


      // ==========================================
      // BALANCE AFTER TRANSACTION
      // ==========================================

      table
        .decimal("balance_after", 12, 2)
        .notNullable();


      // ==========================================
      // SHIPMENT
      // ==========================================

      table
        .uuid("shipment_id")
        .nullable()
        .references("id")
        .inTable("shipments")
        .onDelete("SET NULL")
        .onUpdate("CASCADE");


      // ==========================================
      // REFERENCE
      // ==========================================

      table
        .string("reference", 100)
        .nullable()
        .unique();


      // ==========================================
      // REMARK
      // ==========================================

      table
        .text("remark")
        .nullable();


      // ==========================================
      // TIMESTAMPS
      // ==========================================

      table
        .timestamp("created_at")
        .notNullable()
        .defaultTo(knex.fn.now());


      // ==========================================
      // INDEXES
      // ==========================================

      table.index(
        ["wallet_id"],
        "idx_wallet_transactions_wallet_id"
      );

      table.index(
        ["customer_id"],
        "idx_wallet_transactions_customer_id"
      );

      table.index(
        ["shipment_id"],
        "idx_wallet_transactions_shipment_id"
      );

      table.index(
        ["transaction_type"],
        "idx_wallet_transactions_type"
      );

      table.index(
        ["created_at"],
        "idx_wallet_transactions_created_at"
      );

    }
  );
};


exports.down = function (knex) {

  return knex.schema
    .dropTableIfExists("wallet_transactions");

};