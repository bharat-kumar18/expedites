exports.up = function (knex) {
  return knex.schema.createTable("refunds", function (table) {

    table.uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));

    table.uuid("payment_id")
      .notNullable()
      .references("id")
      .inTable("payments")
      .onDelete("RESTRICT");

    table.uuid("shipment_id")
      .nullable()
      .references("id")
      .inTable("shipments")
      .onDelete("SET NULL");

    table.uuid("customer_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("RESTRICT");

    table.decimal("refund_amount", 12, 2)
      .notNullable();

    table.string("refund_reason", 500)
      .nullable();

    table
      .enu(
        "refund_method",
        ["WALLET", "ORIGINAL_METHOD"],
        {
          useNative: true,
          enumName: "refund_method_enum"
        }
      )
      .notNullable()
      .defaultTo("WALLET");

    table
      .enu(
        "status",
        ["PENDING", "PROCESSING", "SUCCESS", "FAILED"],
        {
          useNative: true,
          enumName: "refund_status_enum"
        }
      )
      .notNullable()
      .defaultTo("PENDING");

    table.string("gateway_refund_id", 255)
      .nullable();

    table.jsonb("gateway_response")
      .nullable();

    table.timestamp("processed_at")
      .nullable();

    table.timestamp("created_at")
      .defaultTo(knex.fn.now());

    table.timestamp("updated_at")
      .defaultTo(knex.fn.now());

    table.index(["payment_id"]);
    table.index(["shipment_id"]);
    table.index(["customer_id"]);
    table.index(["status"]);

  });
};


exports.down = function (knex) {

  return knex.schema
    .dropTableIfExists("refunds")
    .then(() => {
      return knex.raw(
        "DROP TYPE IF EXISTS refund_method_enum"
      );
    })
    .then(() => {
      return knex.raw(
        "DROP TYPE IF EXISTS refund_status_enum"
      );
    });

};