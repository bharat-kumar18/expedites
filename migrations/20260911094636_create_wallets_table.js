/**
 * Create Wallets Table
 *
 * Stores customer wallet balance.
 */

exports.up = function (knex) {
  return knex.schema.createTable("wallets", function (table) {

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
    // CUSTOMER
    // ==========================================

    table
      .uuid("customer_id")
      .notNullable()
      .unique()
      .references("id")
      .inTable("users")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");


    // ==========================================
    // BALANCE
    // ==========================================

    table
      .decimal("balance", 12, 2)
      .notNullable()
      .defaultTo(0);


    // ==========================================
    // WALLET STATUS
    // ==========================================

    table
      .enu(
        "status",
        [
          "ACTIVE",
          "BLOCKED"
        ],
        {
          useNative: true,
          enumName: "wallet_status"
        }
      )
      .notNullable()
      .defaultTo("ACTIVE");


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
    // INDEX
    // ==========================================

    table.index(
      ["customer_id"],
      "idx_wallets_customer_id"
    );

  });
};


exports.down = function (knex) {

  return knex.schema
    .dropTableIfExists("wallets");

};