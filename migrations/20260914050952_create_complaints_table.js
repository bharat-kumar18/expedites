/**
 * Create Complaints Table
 */

exports.up = async function (knex) {

  await knex.schema.createTable(
    "complaints",
    function (table) {

      // ==========================================
      // Primary Key
      // ==========================================

      table
        .uuid("id")
        .primary()
        .defaultTo(
          knex.raw("gen_random_uuid()")
        );


      // ==========================================
      // Complaint Number
      // ==========================================

      table
        .string("complaint_number", 50)
        .notNullable()
        .unique();


      // ==========================================
      // Shipment
      // ==========================================

      table
        .uuid("shipment_id")
        .notNullable()
        .references("id")
        .inTable("shipments")
        .onDelete("CASCADE");


      // ==========================================
      // Customer
      // ==========================================

      table
        .uuid("customer_id")
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("RESTRICT");


      // ==========================================
      // Assigned Admin
      // ==========================================

      table
        .uuid("assigned_to")
        .nullable()
        .references("id")
        .inTable("users")
        .onDelete("SET NULL");


      // ==========================================
      // Category
      // ==========================================

      table
        .string("category", 50)
        .notNullable();


      // ==========================================
      // Priority
      // ==========================================

      table
        .string("priority", 20)
        .notNullable()
        .defaultTo("MEDIUM");


      // ==========================================
      // Subject
      // ==========================================

      table
        .string("subject", 150)
        .notNullable();


      // ==========================================
      // Description
      // ==========================================

      table
        .text("description")
        .notNullable();


      // ==========================================
      // Status
      // ==========================================

      table
        .string("status", 30)
        .notNullable()
        .defaultTo("OPEN");


      // ==========================================
      // Resolution
      // ==========================================

      table
        .text("resolution_note")
        .nullable();


      // ==========================================
      // Resolved At
      // ==========================================

      table
        .timestamp("resolved_at")
        .nullable();


      // ==========================================
      // Closed At
      // ==========================================

      table
        .timestamp("closed_at")
        .nullable();


      // ==========================================
      // Created At
      // ==========================================

      table
        .timestamp("created_at")
        .notNullable()
        .defaultTo(knex.fn.now());


      // ==========================================
      // Updated At
      // ==========================================

      table
        .timestamp("updated_at")
        .notNullable()
        .defaultTo(knex.fn.now());


      // ==========================================
      // Indexes
      // ==========================================

      table.index(
        ["shipment_id"],
        "idx_complaints_shipment"
      );

      table.index(
        ["customer_id"],
        "idx_complaints_customer"
      );

      table.index(
        ["assigned_to"],
        "idx_complaints_assigned_to"
      );

      table.index(
        ["status"],
        "idx_complaints_status"
      );

      table.index(
        ["priority"],
        "idx_complaints_priority"
      );

      table.index(
        ["category"],
        "idx_complaints_category"
      );

      table.index(
        ["created_at"],
        "idx_complaints_created_at"
      );

    }
  );


  // ==========================================
  // Status Constraint
  // ==========================================

  await knex.raw(`
    ALTER TABLE complaints
    ADD CONSTRAINT complaints_status_check
    CHECK (
      status IN (
        'OPEN',
        'ASSIGNED',
        'IN_PROGRESS',
        'RESOLVED',
        'CLOSED',
        'REJECTED'
      )
    )
  `);


  // ==========================================
  // Priority Constraint
  // ==========================================

  await knex.raw(`
    ALTER TABLE complaints
    ADD CONSTRAINT complaints_priority_check
    CHECK (
      priority IN (
        'LOW',
        'MEDIUM',
        'HIGH',
        'URGENT'
      )
    )
  `);


  // ==========================================
  // Category Constraint
  // ==========================================

  await knex.raw(`
    ALTER TABLE complaints
    ADD CONSTRAINT complaints_category_check
    CHECK (
      category IN (
        'PARCEL_DELAY',
        'PARCEL_DAMAGED',
        'PARCEL_LOST',
        'WRONG_DELIVERY',
        'DELIVERY_FAILED',
        'PAYMENT_ISSUE',
        'COD_ISSUE',
        'PICKUP_ISSUE',
        'TRACKING_ISSUE',
        'OTHER'
      )
    )
  `);

};


exports.down = async function (knex) {

  await knex.schema.dropTableIfExists(
    "complaints"
  );

};