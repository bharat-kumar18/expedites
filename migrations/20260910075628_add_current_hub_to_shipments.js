/**
 * Add current_hub_id to shipments
 */

exports.up = function (knex) {

  return knex.schema.alterTable(
    "shipments",
    function (table) {

      table
        .uuid("current_hub_id")
        .references("id")
        .inTable("hubs")
        .onDelete("RESTRICT")
        .onUpdate("CASCADE");

      table.index(
        ["current_hub_id"],
        "idx_shipments_current_hub_id"
      );

    }
  );

};


exports.down = function (knex) {

  return knex.schema.alterTable(
    "shipments",
    function (table) {

      table.dropIndex(
        ["current_hub_id"],
        "idx_shipments_current_hub_id"
      );

      table.dropColumn("current_hub_id");

    }
  );

};