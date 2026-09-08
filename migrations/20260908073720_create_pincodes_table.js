/**
 * Create Pincodes Table
 *
 * A pincode is mapped to a particular hub.
 */

exports.up = function (knex) {

  return knex.schema.createTable("pincodes", function (table) {

    // Primary Key
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));

    // Hub Reference
    table
      .uuid("hub_id")
      .notNullable()
      .references("id")
      .inTable("hubs")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");

    // Pincode
    table
      .string("pincode", 6)
      .notNullable();

    // Area / Locality
    table
      .string("area", 150);

    // Pincode Status
    table
      .enu(
        "status",
        ["ACTIVE", "INACTIVE"],
        {
          useNative: true,
          enumName: "pincode_status",
        }
      )
      .notNullable()
      .defaultTo("ACTIVE");

    // Timestamps
    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo(knex.fn.now());

    table
      .timestamp("updated_at")
      .notNullable()
      .defaultTo(knex.fn.now());


    // Pincode should be unique
    table.unique(
      ["pincode"],
      "unique_pincode"
    );


    // Indexes

    table.index(
      ["hub_id"],
      "idx_pincodes_hub_id"
    );

    table.index(
      ["pincode"],
      "idx_pincodes_pincode"
    );

    table.index(
      ["status"],
      "idx_pincodes_status"
    );

  });

};


exports.down = function (knex) {

  return knex.schema
    .dropTableIfExists("pincodes");

};