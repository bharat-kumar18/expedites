// ==========================================
// Validate Tracking
// ==========================================

const validateTracking = (
  req,
  res,
  next
) => {

  const {
    tracking_number
  } = req.body || {};


  // ==========================================
  // Required Field
  // ==========================================

  if (!tracking_number) {

    return res.status(400).json({

      success: false,

      message:
        "tracking_number is required"

    });

  }


  // ==========================================
  // Format Validation
  // ==========================================

  if (
    typeof tracking_number !== "string"
  ) {

    return res.status(400).json({

      success: false,

      message:
        "tracking_number must be a string"

    });

  }


  next();

};


// ==========================================
// Export
// ==========================================

module.exports = {

  validateTracking

};