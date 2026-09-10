/**
 * Create Shipments Table
 *
 * Customer books a shipment from pickup location
 * to delivery location.
 */

exports.up = function (knex) {
  return knex.schema.createTable("shipments", function (table) {

    // ==========================================
    // PRIMARY KEY
    // ==========================================

    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));


    // ==========================================
    // TRACKING NUMBER
    // ==========================================

    table
      .string("tracking_number", 30)
      .notNullable()
      .unique();


    // ==========================================
    // CUSTOMER
    // ==========================================

    table
      .uuid("customer_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");


    // ==========================================
    // PICKUP DETAILS
    // ==========================================

    table
      .string("pickup_name", 100)
      .notNullable();

    table
      .string("pickup_phone", 15)
      .notNullable();

    table
      .text("pickup_address")
      .notNullable();

    table
      .string("pickup_pincode", 6)
      .notNullable();

    table
      .uuid("pickup_hub_id")
      .notNullable()
      .references("id")
      .inTable("hubs")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");


    // ==========================================
    // DELIVERY DETAILS
    // ==========================================

    table
      .string("receiver_name", 100)
      .notNullable();

    table
      .string("receiver_phone", 15)
      .notNullable();

    table
      .text("receiver_address")
      .notNullable();

    table
      .string("delivery_pincode", 6)
      .notNullable();

    table
      .uuid("delivery_hub_id")
      .notNullable()
      .references("id")
      .inTable("hubs")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");


    // ==========================================
    // PACKAGE DETAILS
    // ==========================================

    table
      .enu(
        "package_type",
        [
          "DOCUMENT",
          "PARCEL",
          "ELECTRONICS",
          "CLOTHING",
          "FOOD",
          "OTHER"
        ],
        {
          useNative: true,
          enumName: "package_type"
        }
      )
      .notNullable();

    table
      .decimal("package_weight", 10, 2)
      .notNullable();

    table
      .decimal("package_length", 10, 2);

    table
      .decimal("package_width", 10, 2);

    table
      .decimal("package_height", 10, 2);


    // ==========================================
    // PAYMENT
    // ==========================================

    table
      .decimal("shipping_charge", 10, 2)
      .notNullable()
      .defaultTo(0);

    table
      .enu(
        "payment_status",
        [
          "PENDING",
          "PAID",
          "FAILED",
          "REFUNDED"
        ],
        {
          useNative: true,
          enumName: "shipment_payment_status"
        }
      )
      .notNullable()
      .defaultTo("PENDING");


    // ==========================================
    // SHIPMENT STATUS
    // ==========================================

    table
      .enu(
        "shipment_status",
        [
          "BOOKED",
          "PICKUP_PENDING",
          "PICKED_UP",
          "IN_TRANSIT",
          "OUT_FOR_DELIVERY",
          "DELIVERED",
          "CANCELLED",
          "RETURNED"
        ],
        {
          useNative: true,
          enumName: "shipment_status"
        }
      )
      .notNullable()
      .defaultTo("BOOKED");


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
    // INDEXES
    // ==========================================

    table.index(
      ["customer_id"],
      "idx_shipments_customer_id"
    );

    table.index(
      ["pickup_hub_id"],
      "idx_shipments_pickup_hub_id"
    );

    table.index(
      ["delivery_hub_id"],
      "idx_shipments_delivery_hub_id"
    );

    table.index(
      ["pickup_pincode"],
      "idx_shipments_pickup_pincode"
    );

    table.index(
      ["delivery_pincode"],
      "idx_shipments_delivery_pincode"
    );

    table.index(
      ["shipment_status"],
      "idx_shipments_status"
    );

    table.index(
      ["payment_status"],
      "idx_shipments_payment_status"
    );

  });
};


exports.down = function (knex) {

  return knex.schema
    .dropTableIfExists("shipments");

};