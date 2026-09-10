/**
 * Add Remark Column to Pickups Table
 *
 * Stores remarks related to pickup operations.
 */

exports.up = function (knex) {
  return knex.schema.alterTable("pickups", function (table) {

    // ==========================================
    // PICKUP REMARK
    // ==========================================

    table
      .text("remark")
      .nullable();

  });
};


exports.down = function (knex) {
  return knex.schema.alterTable("pickups", function (table) {

    table.dropColumn("remark");

  });
};