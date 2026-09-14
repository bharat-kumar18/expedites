const complaintService =
  require("../services/complaintService");


// ==========================================
// Create Complaint
// ==========================================

const createComplaint = async (
  req,
  res
) => {

  try {

    const complaint =
      await complaintService.createComplaint(
        req.user.id,
        req.body
      );


    return res.status(201).json({

      success: true,

      message:
        "Complaint created successfully",

      data: complaint

    });

  } catch (error) {

    console.error(
      "Create Complaint Error:",
      error
    );


    return res.status(400).json({

      success: false,

      message:
        error.message

    });

  }

};


// ==========================================
// Update Complaint
// ==========================================

const updateComplaint = async (
  req,
  res
) => {

  try {

    const complaint =
      await complaintService.updateComplaint(
        req.user.id,
        req.body
      );


    return res.status(200).json({

      success: true,

      message:
        "Complaint updated successfully",

      data: complaint

    });

  } catch (error) {

    console.error(
      "Update Complaint Error:",
      error
    );


    return res.status(400).json({

      success: false,

      message:
        error.message

    });

  }

};


// ==========================================
// Assign Complaint
// ==========================================

const assignComplaint = async (
  req,
  res
) => {

  try {

    const complaint =
      await complaintService.assignComplaint(
        req.user.id,
        req.body
      );


    return res.status(200).json({

      success: true,

      message:
        "Complaint assigned successfully",

      data: complaint

    });

  } catch (error) {

    console.error(
      "Assign Complaint Error:",
      error
    );


    return res.status(400).json({

      success: false,

      message:
        error.message

    });

  }

};


// ==========================================
// Update Status
// ==========================================

const updateComplaintStatus = async (
  req,
  res
) => {

  try {

    const complaint =
      await complaintService
        .updateComplaintStatus(
          req.user.id,
          req.body
        );


    return res.status(200).json({

      success: true,

      message:
        "Complaint status updated successfully",

      data: complaint

    });

  } catch (error) {

    console.error(
      "Update Complaint Status Error:",
      error
    );


    return res.status(400).json({

      success: false,

      message:
        error.message

    });

  }

};


// ==========================================
// Get Complaint
// ==========================================

const getComplaint = async (
  req,
  res
) => {

  try {

    const complaint =
      await complaintService.getComplaint(
        req.body.complaint_id
      );


    return res.status(200).json({

      success: true,

      message:
        "Complaint fetched successfully",

      data: complaint

    });

  } catch (error) {

    return res.status(404).json({

      success: false,

      message:
        error.message

    });

  }

};


// ==========================================
// Get Complaint History
// ==========================================

const getComplaintHistory = async (
  req,
  res
) => {

  try {

    const history =
      await complaintService
        .getComplaintHistory(
          req.body.complaint_id
        );


    return res.status(200).json({

      success: true,

      message:
        "Complaint history fetched successfully",

      data: history

    });

  } catch (error) {

    return res.status(404).json({

      success: false,

      message:
        error.message

    });

  }

};


// ==========================================
// Get All Complaints
// ==========================================

const getAllComplaints = async (
  req,
  res
) => {

  try {

    const result =
      await complaintService
        .getAllComplaints(
          req.body
        );


    return res.status(200).json({

      success: true,

      message:
        "Complaints fetched successfully",

      ...result

    });

  } catch (error) {

    console.error(
      "Get All Complaints Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

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