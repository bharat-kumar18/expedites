/**
 * Create Complaint History Table
 */

exports.up = function (knex) {

  return knex.schema.createTable(
    "complaint_history",
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
      // Complaint
      // ==========================================

      table
        .uuid("complaint_id")
        .notNullable()
        .references("id")
        .inTable("complaints")
        .onDelete("CASCADE");


      // ==========================================
      // Changed By
      // ==========================================

      table
        .uuid("changed_by")
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("RESTRICT");


      // ==========================================
      // Old Status
      // ==========================================

      table
        .string("old_status", 30)
        .nullable();


      // ==========================================
      // New Status
      // ==========================================

      table
        .string("new_status", 30)
        .notNullable();


      // ==========================================
      // Remark
      // ==========================================

      table
        .text("remark")
        .nullable();


      // ==========================================
      // Created At
      // ==========================================

      table
        .timestamp("created_at")
        .notNullable()
        .defaultTo(knex.fn.now());


      // ==========================================
      // Indexes
      // ==========================================

      table.index(
        ["complaint_id"],
        "idx_complaint_history_complaint"
      );

      table.index(
        ["changed_by"],
        "idx_complaint_history_changed_by"
      );

      table.index(
        ["created_at"],
        "idx_complaint_history_created_at"
      );

    }
  );

};


exports.down = function (knex) {

  return knex.schema.dropTableIfExists(
    "complaint_history"
  );

};