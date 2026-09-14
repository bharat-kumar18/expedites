/**
 * Create Shipment Costs Table
 *
 * Stores internal shipment cost calculation.
 */

exports.up = function (knex) {
  return knex.schema.createTable("shipment_costs", function (table) {

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
    // DISTANCE
    // ==========================================

    table
      .decimal("distance_km", 10, 2)
      .notNullable()
      .defaultTo(0);


    // ==========================================
    // FUEL COST
    // ==========================================

    table
      .decimal("fuel_cost", 12, 2)
      .notNullable()
      .defaultTo(0);


    // ==========================================
    // LABOUR COST
    // ==========================================

    table
      .decimal("labour_cost", 12, 2)
      .notNullable()
      .defaultTo(0);


    // ==========================================
    // TRANSPORT COST
    // ==========================================

    table
      .decimal("transport_cost", 12, 2)
      .notNullable()
      .defaultTo(0);


    // ==========================================
    // TOTAL COST
    // ==========================================

    table
      .decimal("total_cost", 12, 2)
      .notNullable()
      .defaultTo(0);


    // ==========================================
    // SHIPPING REVENUE
    // ==========================================

    table
      .decimal("shipping_revenue", 12, 2)
      .notNullable()
      .defaultTo(0);


    // ==========================================
    // COMPANY MARGIN
    // ==========================================

    table
      .decimal("company_margin", 12, 2)
      .notNullable()
      .defaultTo(0);


    // ==========================================
    // CREATED / UPDATED
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
    // INDEX
    // ==========================================

    table.index(
      ["shipment_id"],
      "idx_shipment_costs_shipment_id"
    );

  });
};


exports.down = function (knex) {

  return knex.schema
    .dropTableIfExists("shipment_costs");

};