/**
 * Create Hubs Table
 *
 * One city can have many hubs.
 *
 * Example:
 *
 * Delhi
 *   ├── Delhi North Hub
 *   ├── Delhi South Hub
 *   └── Delhi Central Hub
 */

exports.up = function (knex) {

  return knex.schema.createTable("hubs", function (table) {

    // Primary Key
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));

    // City Reference
    table
      .uuid("city_id")
      .notNullable()
      .references("id")
      .inTable("cities")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");

    // Hub Name
    table
      .string("name", 150)
      .notNullable();

    // Hub Code
    table
      .string("hub_code", 50)
      .notNullable()
      .unique();

    // Hub Address
    table
      .text("address")
      .notNullable();

    // Hub Contact Number
    table
      .string("phone", 15);

    // Hub Email
    table
      .string("email", 150);

    // Hub Status
    table
      .enu(
        "status",
        ["ACTIVE", "INACTIVE"],
        {
          useNative: true,
          enumName: "hub_status",
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


    // Indexes

    table.index(
      ["city_id"],
      "idx_hubs_city_id"
    );

    table.index(
      ["status"],
      "idx_hubs_status"
    );

    table.index(
            ["name"],
            "idx_hubs_name"
        );

  });

};


exports.down = function (knex) {

  return knex.schema
    .dropTableIfExists("hubs");

};