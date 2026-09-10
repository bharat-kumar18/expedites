/**
 * Create Pickups Table
 *
 * Stores pickup assignment and pickup status
 * for a shipment.
 */

exports.up = function (knex) {
  return knex.schema.createTable("pickups", function (table) {

    // ==========================================
    // PRIMARY KEY
    // ==========================================

    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));


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
    // PICKUP AGENT
    // ==========================================

    table
      .uuid("pickup_agent_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");


    // ==========================================
    // PICKUP STATUS
    // ==========================================

    table
      .enu(
        "status",
        [
          "ASSIGNED",
          "ACCEPTED",
          "PICKED_UP",
          "FAILED",
          "CANCELLED"
        ],
        {
          useNative: true,
          enumName: "pickup_status"
        }
      )
      .notNullable()
      .defaultTo("ASSIGNED");


    // ==========================================
    // ASSIGNMENT TIME
    // ==========================================

    table
      .timestamp("assigned_at")
      .notNullable()
      .defaultTo(knex.fn.now());


    // ==========================================
    // ACCEPTED TIME
    // ==========================================

    table
      .timestamp("accepted_at");


    // ==========================================
    // PICKED UP TIME
    // ==========================================

    table
      .timestamp("picked_up_at");


    // ==========================================
    // FAILURE REASON
    // ==========================================

    table
      .text("failure_reason");


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
      "idx_pickups_shipment_id"
    );

    table.index(
      ["pickup_agent_id"],
      "idx_pickups_agent_id"
    );

    table.index(
      ["status"],
      "idx_pickups_status"
    );

  });
};


exports.down = function (knex) {

  return knex.schema
    .dropTableIfExists("pickups");

};