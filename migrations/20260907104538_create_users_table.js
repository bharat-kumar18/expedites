exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));

    table.string("name", 100).notNullable();

    table.string("email", 150).notNullable().unique();

    table.string("phone", 15).notNullable().unique();

    table.text("password_hash").notNullable();

    table
      .string("role", 30)
      .notNullable();

    table
      .string("status", 20)
      .notNullable()
      .defaultTo("ACTIVE");

    table
      .timestamp("created_at")
      .defaultTo(knex.fn.now());

    table
      .timestamp("updated_at")
      .defaultTo(knex.fn.now());

    table.check(
      "role IN ('CUSTOMER', 'PICKUP_AGENT', 'DELIVERY_AGENT', 'ADMIN')"
    );

    table.check(
      "status IN ('ACTIVE', 'INACTIVE', 'BLOCKED')"
    );
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};