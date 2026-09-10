/**
 * Create Shipment Hub Movements Table
 *
 * Stores the movement/history of a shipment
 * from one hub to another hub.
 */

exports.up = function (knex) {

  return knex.schema.createTable(
    "shipment_hub_movements",
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
      // SHIPMENT
      // ==========================================

      table
        .uuid("shipment_id")
        .notNullable()
        .references("id")
        .inTable("shipments")
        .onDelete("RESTRICT")
        .onUpdate("CASCADE");


      // ==========================================
      // FROM HUB
      // ==========================================

      table
        .uuid("from_hub_id")
        .notNullable()
        .references("id")
        .inTable("hubs")
        .onDelete("RESTRICT")
        .onUpdate("CASCADE");


      // ==========================================
      // TO HUB
      // ==========================================

      table
        .uuid("to_hub_id")
        .notNullable()
        .references("id")
        .inTable("hubs")
        .onDelete("RESTRICT")
        .onUpdate("CASCADE");


      // ==========================================
      // MOVEMENT STATUS
      // ==========================================

      table
        .enu(
          "status",
          [
            "PENDING",
            "IN_TRANSIT",
            "ARRIVED",
            "COMPLETED",
            "CANCELLED"
          ],
          {
            useNative: true,
            enumName: "shipment_hub_movement_status"
          }
        )
        .notNullable()
        .defaultTo("PENDING");


      // ==========================================
      // DISPATCHED AT
      // ==========================================

      table
        .timestamp("dispatched_at");


      // ==========================================
      // ARRIVED AT
      // ==========================================

      table
        .timestamp("arrived_at");


      // ==========================================
      // COMPLETED AT
      // ==========================================

      table
        .timestamp("completed_at");


      // ==========================================
      // REMARK
      // ==========================================

      table
        .text("remark");


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
      // INDEXES
      // ==========================================

      table.index(
        ["shipment_id"],
        "idx_shipment_hub_movements_shipment_id"
      );

      table.index(
        ["from_hub_id"],
        "idx_shipment_hub_movements_from_hub_id"
      );

      table.index(
        ["to_hub_id"],
        "idx_shipment_hub_movements_to_hub_id"
      );

      table.index(
        ["status"],
        "idx_shipment_hub_movements_status"
      );

    }
  );

};


exports.down = function (knex) {

  return knex.schema
    .dropTableIfExists(
      "shipment_hub_movements"
    );

};