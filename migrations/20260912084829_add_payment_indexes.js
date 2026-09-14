exports.up = async function (knex) {

  await knex.schema.alterTable("payments", function (table) {

    table.index(["customer_id"]);
    table.index(["shipment_id"]);
    table.index(["payment_type"]);
    table.index(["status"]);
    table.index(["created_at"]);

  });

};


exports.down = async function (knex) {

  await knex.schema.alterTable("payments", function (table) {

    table.dropIndex(["customer_id"]);
    table.dropIndex(["shipment_id"]);
    table.dropIndex(["payment_type"]);
    table.dropIndex(["status"]);
    table.dropIndex(["created_at"]);

  });

};