const { pool } =
  require("../config/db");

const complaintModel =
  require("../models/complaintModel");


// ==========================================
// Generate Complaint Number
// ==========================================

const generateComplaintNumber = () => {

  const timestamp =
    Date.now();

  const random =
    Math.floor(
      1000 +
      Math.random() * 9000
    );

  return `CMP${timestamp}${random}`;

};


// ==========================================
// Create Complaint
// ==========================================

const createComplaint = async (
  customerId,
  data
) => {

  const client =
    await pool.connect();


  try {

    await client.query("BEGIN");


    // ==========================================
    // Check Existing Complaint
    // ==========================================

    const existing =
      await complaintModel
        .findComplaintByShipmentAndCustomer(
          client,
          data.shipment_id,
          customerId
        );


    if (existing) {

      throw new Error(
        "An active complaint already exists for this shipment"
      );

    }


    // ==========================================
    // Create Complaint
    // ==========================================

    const complaint =
      await complaintModel.createComplaint(
        client,
        {

          complaint_number:
            generateComplaintNumber(),

          shipment_id:
            data.shipment_id,

          customer_id:
            customerId,

          category:
            data.category,

          priority:
            data.priority || "MEDIUM",

          subject:
            data.subject,

          description:
            data.description

        }
      );


    // ==========================================
    // Create Initial History
    // ==========================================

    await complaintModel.createComplaintHistory(
      client,
      {

        complaint_id:
          complaint.id,

        changed_by:
          customerId,

        old_status:
          null,

        new_status:
          "OPEN",

        remark:
          "Complaint created"

      }
    );


    await client.query("COMMIT");


    return complaint;

  } catch (error) {

    await client.query(
      "ROLLBACK"
    );

    throw error;

  } finally {

    client.release();

  }

};


// ==========================================
// Update Complaint
// ==========================================

const updateComplaint = async (
  userId,
  data
) => {

  const client =
    await pool.connect();


  try {

    await client.query("BEGIN");


    const complaint =
      await complaintModel.findComplaintById(
        client,
        data.complaint_id
      );


    if (!complaint) {

      throw new Error(
        "Complaint not found"
      );

    }


    if (
      [
        "CLOSED",
        "REJECTED"
      ].includes(
        complaint.status
      )
    ) {

      throw new Error(
        "Closed or rejected complaint cannot be updated"
      );

    }


    const updated =
      await complaintModel.updateComplaint(
        client,
        data.complaint_id,
        data
      );


    await client.query("COMMIT");


    return updated;

  } catch (error) {

    await client.query(
      "ROLLBACK"
    );

    throw error;

  } finally {

    client.release();

  }

};


// ==========================================
// Assign Complaint
// ==========================================

const assignComplaint = async (
  changedBy,
  data
) => {

  const client =
    await pool.connect();


  try {

    await client.query("BEGIN");


    const complaint =
      await complaintModel.findComplaintById(
        client,
        data.complaint_id
      );


    if (!complaint) {

      throw new Error(
        "Complaint not found"
      );

    }


    const updated =
      await complaintModel.assignComplaint(
        client,
        data.complaint_id,
        data.admin_id
      );


    await complaintModel.createComplaintHistory(
      client,
      {

        complaint_id:
          complaint.id,

        changed_by:
          changedBy,

        old_status:
          complaint.status,

        new_status:
          "ASSIGNED",

        remark:
          data.remark ||
          "Complaint assigned"

      }
    );


    await client.query("COMMIT");


    return updated;

  } catch (error) {

    await client.query(
      "ROLLBACK"
    );

    throw error;

  } finally {

    client.release();

  }

};


// ==========================================
// Update Status
// ==========================================

const updateComplaintStatus = async (
  changedBy,
  data
) => {

  const client =
    await pool.connect();


  try {

    await client.query("BEGIN");


    const complaint =
      await complaintModel.findComplaintById(
        client,
        data.complaint_id
      );


    if (!complaint) {

      throw new Error(
        "Complaint not found"
      );

    }


    // ==========================================
    // Prevent Changes After Closed
    // ==========================================

    if (
      complaint.status === "CLOSED"
    ) {

      throw new Error(
        "Closed complaint cannot be updated"
      );

    }


    // ==========================================
    // Resolution Note
    // ==========================================

    if (
      data.status === "RESOLVED" &&
      !data.remark
    ) {

      throw new Error(
        "Resolution remark is required"
      );

    }


    const updated =
      await complaintModel
        .updateComplaintStatus(
          client,
          data.complaint_id,
          data.status,
          data.remark || null
        );


    await complaintModel
      .createComplaintHistory(
        client,
        {

          complaint_id:
            complaint.id,

          changed_by:
            changedBy,

          old_status:
            complaint.status,

          new_status:
            data.status,

          remark:
            data.remark

        }
      );


    await client.query("COMMIT");


    return updated;

  } catch (error) {

    await client.query(
      "ROLLBACK"
    );

    throw error;

  } finally {

    client.release();

  }

};


// ==========================================
// Get Complaint
// ==========================================

const getComplaint = async (
  complaintId
) => {

  const complaint =
    await complaintModel.getComplaint(
      complaintId
    );


  if (!complaint) {

    throw new Error(
      "Complaint not found"
    );

  }


  return complaint;

};


// ==========================================
// Get Complaint History
// ==========================================

const getComplaintHistory = async (
  complaintId
) => {

  const complaint =
    await complaintModel.getComplaint(
      complaintId
    );


  if (!complaint) {

    throw new Error(
      "Complaint not found"
    );

  }


  return complaintModel
    .getComplaintHistory(
      complaintId
    );

};


// ==========================================
// Get All Complaints
// ==========================================

const getAllComplaints = async (
  filters
) => {

  return complaintModel
    .getAllComplaints(
      filters
    );

};


module.exports = {

  createComplaint,
  updateComplaint,
  assignComplaint,
  updateComplaintStatus,
  getComplaint,
  getComplaintHistory,
  getAllComplaints

};