const { pool } = require("../config/db");


// ==========================================
// Create Complaint
// ==========================================

const createComplaint = async (
  client,
  data
) => {

  const result = await client.query(
    `
    INSERT INTO complaints
    (
      complaint_number,
      shipment_id,
      customer_id,
      category,
      priority,
      subject,
      description,
      status
    )
    VALUES
    (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $7,
      'OPEN'
    )
    RETURNING *
    `,
    [
      data.complaint_number,
      data.shipment_id,
      data.customer_id,
      data.category,
      data.priority,
      data.subject,
      data.description
    ]
  );

  return result.rows[0];

};


// ==========================================
// Find Complaint By ID
// ==========================================

const findComplaintById = async (
  client,
  complaintId
) => {

  const result = await client.query(
    `
    SELECT *
    FROM complaints
    WHERE id = $1
    `,
    [complaintId]
  );

  return result.rows[0];

};


// ==========================================
// Find Complaint By Number
// ==========================================

const findComplaintByNumber = async (
  complaintNumber
) => {

  const result = await pool.query(
    `
    SELECT *
    FROM complaints
    WHERE complaint_number = $1
    `,
    [complaintNumber]
  );

  return result.rows[0];

};


// ==========================================
// Check Existing Complaint
// ==========================================

const findComplaintByShipmentAndCustomer = async (
  client,
  shipmentId,
  customerId
) => {

  const result = await client.query(
    `
    SELECT *
    FROM complaints
    WHERE shipment_id = $1
      AND customer_id = $2
      AND status NOT IN (
        'CLOSED',
        'REJECTED'
      )
    `,
    [
      shipmentId,
      customerId
    ]
  );

  return result.rows[0];

};


// ==========================================
// Update Complaint
// ==========================================

const updateComplaint = async (
  client,
  complaintId,
  data
) => {

  const result = await client.query(
    `
    UPDATE complaints
    SET
      category = COALESCE($1, category),
      priority = COALESCE($2, priority),
      subject = COALESCE($3, subject),
      description = COALESCE($4, description),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING *
    `,
    [
      data.category || null,
      data.priority || null,
      data.subject || null,
      data.description || null,
      complaintId
    ]
  );

  return result.rows[0];

};


// ==========================================
// Assign Complaint
// ==========================================

const assignComplaint = async (
  client,
  complaintId,
  adminId
) => {

  const result = await client.query(
    `
    UPDATE complaints
    SET
      assigned_to = $1,
      status = 'ASSIGNED',
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
    `,
    [
      adminId,
      complaintId
    ]
  );

  return result.rows[0];

};


// ==========================================
// Update Complaint Status
// ==========================================

const updateComplaintStatus = async (
  client,
  complaintId,
  status,
  resolutionNote = null
) => {

  const result = await client.query(
    `
    UPDATE complaints
    SET
      status = $1::varchar,

      resolution_note = CASE
        WHEN $1::varchar = 'RESOLVED'
        THEN $2::text
        ELSE resolution_note
      END,

      resolved_at = CASE
        WHEN $1::varchar = 'RESOLVED'
        THEN CURRENT_TIMESTAMP
        ELSE resolved_at
      END,

      closed_at = CASE
        WHEN $1::varchar = 'CLOSED'
        THEN CURRENT_TIMESTAMP
        ELSE closed_at
      END,

      updated_at = CURRENT_TIMESTAMP

    WHERE id = $3::uuid

    RETURNING *
    `,
    [
      status,
      resolutionNote,
      complaintId
    ]
  );

  return result.rows[0] || null;
};


// ==========================================
// Create History
// ==========================================

const createComplaintHistory = async (
  client,
  data
) => {

  const result = await client.query(
    `
    INSERT INTO complaint_history
    (
      complaint_id,
      changed_by,
      old_status,
      new_status,
      remark
    )
    VALUES
    (
      $1,
      $2,
      $3,
      $4,
      $5
    )
    RETURNING *
    `,
    [
      data.complaint_id,
      data.changed_by,
      data.old_status || null,
      data.new_status,
      data.remark || null
    ]
  );

  return result.rows[0];

};


// ==========================================
// Get Complaint History
// ==========================================

const getComplaintHistory = async (
  complaintId
) => {

  const result = await pool.query(
    `
    SELECT
      ch.*,
      u.name AS changed_by_name
    FROM complaint_history ch

    JOIN users u
      ON ch.changed_by = u.id

    WHERE ch.complaint_id = $1

    ORDER BY ch.created_at ASC
    `,
    [complaintId]
  );

  return result.rows;

};


// ==========================================
// Get Complaint
// ==========================================

const getComplaint = async (
  complaintId
) => {

  const result = await pool.query(
    `
    SELECT

      c.*,

      s.tracking_number,

      customer.name AS customer_name,
      customer.phone AS customer_phone,

      admin.name AS assigned_admin_name

    FROM complaints c

    JOIN shipments s
      ON c.shipment_id = s.id

    JOIN users customer
      ON c.customer_id = customer.id

    LEFT JOIN users admin
      ON c.assigned_to = admin.id

    WHERE c.id = $1
    `,
    [complaintId]
  );

  return result.rows[0];

};


// ==========================================
// Get All Complaints
// ==========================================

const getAllComplaints = async (
  filters = {}
) => {

  const {
    page = 1,
    limit = 10,
    status,
    priority,
    category,
    search
  } = filters;


  const offset =
    (page - 1) * limit;


  const values = [];

  const conditions = [];


  if (status) {

    values.push(status);

    conditions.push(
      `c.status = $${values.length}`
    );

  }


  if (priority) {

    values.push(priority);

    conditions.push(
      `c.priority = $${values.length}`
    );

  }


  if (category) {

    values.push(category);

    conditions.push(
      `c.category = $${values.length}`
    );

  }


  if (search) {

    values.push(`%${search}%`);

    conditions.push(`
      (
        c.complaint_number ILIKE $${values.length}
        OR
        c.subject ILIKE $${values.length}
        OR
        s.tracking_number ILIKE $${values.length}
      )
    `);

  }


  const whereClause =
    conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";


  const dataValues = [
    ...values,
    limit,
    offset
  ];


  const result = await pool.query(
    `
    SELECT

      c.id,
      c.complaint_number,
      c.shipment_id,
      c.category,
      c.priority,
      c.subject,
      c.status,
      c.created_at,
      c.updated_at,

      s.tracking_number,

      customer.name AS customer_name,

      admin.name AS assigned_admin_name

    FROM complaints c

    JOIN shipments s
      ON c.shipment_id = s.id

    JOIN users customer
      ON c.customer_id = customer.id

    LEFT JOIN users admin
      ON c.assigned_to = admin.id

    ${whereClause}

    ORDER BY c.created_at DESC

    LIMIT $${dataValues.length - 1}
    OFFSET $${dataValues.length}
    `,
    dataValues
  );


  const countResult = await pool.query(
    `
    SELECT COUNT(*) AS total

    FROM complaints c

    JOIN shipments s
      ON c.shipment_id = s.id

    ${whereClause}
    `,
    values
  );


  const total =
    Number(
      countResult.rows[0].total
    );


  return {

    data: result.rows,

    pagination: {

      page: Number(page),

      limit: Number(limit),

      total,

      totalPages:
        Math.ceil(
          total / limit
        )

    }

  };

};


module.exports = {

  createComplaint,
  findComplaintById,
  findComplaintByNumber,
  findComplaintByShipmentAndCustomer,
  updateComplaint,
  assignComplaint,
  updateComplaintStatus,
  createComplaintHistory,
  getComplaintHistory,
  getComplaint,
  getAllComplaints

};