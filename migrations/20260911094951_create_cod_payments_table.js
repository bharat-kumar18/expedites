/**
 * Create COD Payments Table
 *
 * Handles Cash On Delivery collection,
 * reconciliation and seller settlement.
 */

exports.up = function (knex) {
  return knex.schema.createTable("cod_payments", function (table) {

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
    // SHIPMENT
    // ==========================================

    table
      .uuid("shipment_id")
      .notNullable()
      .unique()
      .references("id")
      .inTable("shipments")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");


    // ==========================================
    // SELLER / CUSTOMER
    // ==========================================

    table
      .uuid("seller_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");


    // ==========================================
    // DELIVERY AGENT
    // ==========================================

    table
      .uuid("delivery_agent_id")
      .nullable()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");


    // ==========================================
    // COD AMOUNT
    // ==========================================

    table
      .decimal("cod_amount", 12, 2)
      .notNullable();


    // ==========================================
    // COD COLLECTION METHOD
    // ==========================================

    table
      .enu(
        "collection_method",
        [
          "CASH",
          "UPI"
        ],
        {
          useNative: true,
          enumName: "cod_collection_method"
        }
      )
      .nullable();


    // ==========================================
    // COLLECTION STATUS
    // ==========================================

    table
      .enu(
        "collection_status",
        [
          "PENDING",
          "COLLECTED",
          "RECONCILIATION_PENDING",
          "RECONCILED",
          "FAILED",
          "CANCELLED"
        ],
        {
          useNative: true,
          enumName: "cod_collection_status"
        }
      )
      .notNullable()
      .defaultTo("PENDING");


    // ==========================================
    // RECONCILIATION STATUS
    // ==========================================

    table
      .enu(
        "reconciliation_status",
        [
          "PENDING",
          "VERIFIED",
          "REJECTED"
        ],
        {
          useNative: true,
          enumName: "cod_reconciliation_status"
        }
      )
      .notNullable()
      .defaultTo("PENDING");


    // ==========================================
    // COLLECTED AT
    // ==========================================

    table
      .timestamp("collected_at")
      .nullable();


    // ==========================================
    // RECONCILED AT
    // ==========================================

    table
      .timestamp("reconciled_at")
      .nullable();


    // ==========================================
    // SETTLEMENT ELIGIBLE AT
    // ==========================================

    table
      .timestamp("settlement_eligible_at")
      .nullable();


    // ==========================================
    // SETTLEMENT STATUS
    // ==========================================

    table
      .enu(
        "settlement_status",
        [
          "NOT_ELIGIBLE",
          "ELIGIBLE",
          "PROCESSING",
          "SETTLED",
          "FAILED"
        ],
        {
          useNative: true,
          enumName: "cod_settlement_status"
        }
      )
      .notNullable()
      .defaultTo("NOT_ELIGIBLE");


    // ==========================================
    // SELLER PAYABLE
    // ==========================================

    table
      .decimal("seller_amount", 12, 2)
      .nullable();


    // ==========================================
    // COMPANY FEE
    // ==========================================

    table
      .decimal("company_fee", 12, 2)
      .nullable();


    // ==========================================
    // SETTLED AT
    // ==========================================

    table
      .timestamp("settled_at")
      .nullable();


    // ==========================================
    // TRANSACTION REFERENCE
    // ==========================================

    table
      .string("settlement_reference", 150)
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

    table
      .timestamp("updated_at")
      .notNullable()
      .defaultTo(knex.fn.now());


    // ==========================================
    // INDEXES
    // ==========================================

    table.index(
      ["shipment_id"],
      "idx_cod_shipment_id"
    );

    table.index(
      ["seller_id"],
      "idx_cod_seller_id"
    );

    table.index(
      ["delivery_agent_id"],
      "idx_cod_delivery_agent_id"
    );

    table.index(
      ["collection_status"],
      "idx_cod_collection_status"
    );

    table.index(
      ["reconciliation_status"],
      "idx_cod_reconciliation_status"
    );

    table.index(
      ["settlement_status"],
      "idx_cod_settlement_status"
    );

    table.index(
      ["settlement_eligible_at"],
      "idx_cod_settlement_eligible_at"
    );

  });
};


exports.down = function (knex) {

  return knex.schema
    .dropTableIfExists("cod_payments");

};