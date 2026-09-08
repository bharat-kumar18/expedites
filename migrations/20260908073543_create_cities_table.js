/**
 * Create Cities Table
 *
 * A city can have multiple hubs.
 */

exports.up = function (knex) {

  return knex.schema.createTable("cities", function (table) {

    // Primary Key
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));

    // City Name
    table
      .string("name", 100)
      .notNullable();

    // State
    table
      .string("state", 100)
      .notNullable();

    // Country
    table
      .string("country", 100)
      .notNullable()
      .defaultTo("India");

    // City Status
    table
      .enu(
        "status",
        ["ACTIVE", "INACTIVE"],
        {
          useNative: true,
          enumName: "city_status",
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


    // Prevent duplicate city + state
    table.unique(
      ["name", "state"],
      "unique_city_state"
    );

    // Index
    table.index(
      ["name"],
      "idx_cities_name"
    );

    table.index(
      ["state"],
      "idx_cities_state"
    );

  });

};


exports.down = function (knex) {

  return knex.schema
    .dropTableIfExists("cities");

};