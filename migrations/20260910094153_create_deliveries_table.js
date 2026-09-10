/**
 * Create Deliveries Table
 *
 * Stores delivery-agent assignment
 * for each shipment.
 */

exports.up = function (knex) {

  return knex.schema.createTable("deliveries", function (table) {

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
    // DELIVERY AGENT
    // ==========================================

    table
      .uuid("delivery_agent_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");


    // ==========================================
    // DELIVERY STATUS
    // ==========================================

    table
      .enu(
        "status",
        [
          "ASSIGNED",
          "ACCEPTED",
          "OUT_FOR_DELIVERY",
          "DELIVERED",
          "FAILED",
          "CANCELLED"
        ],
        {
          useNative: true,
          enumName: "delivery_status"
        }
      )
      .notNullable()
      .defaultTo("ASSIGNED");


    // ==========================================
    // ASSIGNMENT TIMESTAMP
    // ==========================================

    table
      .timestamp("assigned_at")
      .notNullable()
      .defaultTo(knex.fn.now());


    // ==========================================
    // ACCEPTED TIMESTAMP
    // ==========================================

    table
      .timestamp("accepted_at")
      .nullable();


    // ==========================================
    // OUT FOR DELIVERY TIMESTAMP
    // ==========================================

    table
      .timestamp("out_for_delivery_at")
      .nullable();


    // ==========================================
    // DELIVERED TIMESTAMP
    // ==========================================

    table
      .timestamp("delivered_at")
      .nullable();


    // ==========================================
    // FAILURE REASON
    // ==========================================

    table
      .text("failure_reason")
      .nullable();


    // ==========================================
    // DELIVERY REMARK
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
      "idx_deliveries_shipment_id"
    );


    table.index(
      ["delivery_agent_id"],
      "idx_deliveries_delivery_agent_id"
    );


    table.index(
      ["status"],
      "idx_deliveries_status"
    );

  });

};


exports.down = function (knex) {

  return knex.schema
    .dropTableIfExists("deliveries");

};