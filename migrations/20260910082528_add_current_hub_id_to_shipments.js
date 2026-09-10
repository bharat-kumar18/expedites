/**
 * Add Current Hub ID to Shipments
 *
 * Stores the hub where the shipment is currently located.
 */

exports.up = function (knex) {

  return knex.schema.alterTable("shipments", function (table) {

    table
      .uuid("current_hub_id")
      .nullable()
      .references("id")
      .inTable("hubs")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");

    // Index for faster current-hub searches
    table.index(
      ["current_hub_id"],
      "idx_shipments_current_hub_id"
    );

  });

};


exports.down = function (knex) {

  return knex.schema.alterTable("shipments", function (table) {

    table.dropIndex(
      ["current_hub_id"],
      "idx_shipments_current_hub_id"
    );

    table.dropColumn("current_hub_id");

  });

};