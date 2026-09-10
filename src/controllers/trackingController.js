const trackingService =
  require("../services/trackingService");


// ==========================================
// Track Shipment
// ==========================================

const trackShipment = async (
  req,
  res
) => {

  try {

    const {
      tracking_number
    } = req.body;


    // ==========================================
    // Get Tracking Details
    // ==========================================

    const tracking =
      await trackingService.trackShipment(
        tracking_number
      );


    return res.status(200).json({

      success: true,

      message:
        "Shipment tracking fetched successfully",

      data: tracking

    });


  } catch (error) {

    console.error(
      "Track shipment error:",
      error.message
    );


    return res.status(404).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// Export
// ==========================================

module.exports = {

  trackShipment

};