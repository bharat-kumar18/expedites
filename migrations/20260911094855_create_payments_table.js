/**
 * Create Payments Table
 *
 * Stores payment gateway transactions.
 */

exports.up = function (knex) {
  return knex.schema.createTable("payments", function (table) {

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
    // PAYMENT TYPE
    // ==========================================

    table
      .enu(
        "payment_type",
        [
          "WALLET_RECHARGE",
          "SHIPMENT_PAYMENT"
        ],
        {
          useNative: true,
          enumName: "payment_type"
        }
      )
      .notNullable();


    // ==========================================
    // PAYMENT METHOD
    // ==========================================

    table
      .enu(
        "payment_method",
        [
          "UPI",
          "CARD",
          "NET_BANKING",
          "WALLET"
        ],
        {
          useNative: true,
          enumName: "payment_method"
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
    // PAYMENT STATUS
    // ==========================================

    table
      .enu(
        "status",
        [
          "PENDING",
          "SUCCESS",
          "FAILED",
          "REFUNDED"
        ],
        {
          useNative: true,
          enumName: "payment_status"
        }
      )
      .notNullable()
      .defaultTo("PENDING");


    // ==========================================
    // GATEWAY
    // ==========================================

    table
      .string("gateway", 50)
      .nullable();


    // ==========================================
    // GATEWAY ORDER ID
    // ==========================================

    table
      .string("gateway_order_id", 150)
      .nullable()
      .unique();


    // ==========================================
    // GATEWAY PAYMENT ID
    // ==========================================

    table
      .string("gateway_payment_id", 150)
      .nullable()
      .unique();


    // ==========================================
    // GATEWAY RESPONSE
    // ==========================================

    table
      .jsonb("gateway_response")
      .nullable();


    // ==========================================
    // TIMESTAMPS
    // ==========================================

    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo(knex.fn.now());

    table
      .timestamp("updated_at")
      .notNullable()
      .defaultTo(knex.fn.now());


    // ==========================================
    // INDEXES
    // ==========================================

    table.index(
      ["customer_id"],
      "idx_payments_customer_id"
    );

    table.index(
      ["shipment_id"],
      "idx_payments_shipment_id"
    );

    table.index(
      ["status"],
      "idx_payments_status"
    );

    table.index(
      ["payment_type"],
      "idx_payments_type"
    );

  });
};


exports.down = function (knex) {

  return knex.schema
    .dropTableIfExists("payments");

};