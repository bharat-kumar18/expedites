const reportService =
  require("../services/reportService");


// ==========================================
// Dashboard
// ==========================================

const getDashboardSummary = async (req, res) => {

  try {

    const result =
      await reportService.getDashboardSummary(
        req.body || {}
      );


    return res.status(200).json({

      success: true,

      message:
        "Dashboard report fetched successfully",

      data: result

    });

  } catch (error) {

    console.error(
      "Dashboard Report Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch dashboard report"

    });

  }

};


// ==========================================
// Shipment Report
// ==========================================

const getShipmentReport = async (req, res) => {

  try {

    const result =
      await reportService.getShipmentReport(
        req.body || {}
      );


    return res.status(200).json({

      success: true,

      message:
        "Shipment report fetched successfully",

      data: result

    });

  } catch (error) {

    console.error(
      "Shipment Report Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch shipment report"

    });

  }

};


// ==========================================
// Payment Report
// ==========================================

const getPaymentReport = async (req, res) => {

  try {

    const result =
      await reportService.getPaymentReport(
        req.body || {}
      );


    return res.status(200).json({

      success: true,

      message:
        "Payment report fetched successfully",

      data: result

    });

  } catch (error) {

    console.error(
      "Payment Report Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch payment report"

    });

  }

};


// ==========================================
// COD Report
// ==========================================

const getCODReport = async (req, res) => {

  try {

    const result =
      await reportService.getCODReport(
        req.body || {}
      );


    return res.status(200).json({

      success: true,

      message:
        "COD report fetched successfully",

      data: result

    });

  } catch (error) {

    console.error(
      "COD Report Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch COD report"

    });

  }

};


// ==========================================
// Wallet Report
// ==========================================

const getWalletReport = async (req, res) => {

  try {

    const result =
      await reportService.getWalletReport(
        req.body || {}
      );


    return res.status(200).json({

      success: true,

      message:
        "Wallet report fetched successfully",

      data: result

    });

  } catch (error) {

    console.error(
      "Wallet Report Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch wallet report"

    });

  }

};


// ==========================================
// Complaint Report
// ==========================================

const getComplaintReport = async (req, res) => {

  try {

    const result =
      await reportService.getComplaintReport(
        req.body || {}
      );


    return res.status(200).json({

      success: true,

      message:
        "Complaint report fetched successfully",

      data: result

    });

  } catch (error) {

    console.error(
      "Complaint Report Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch complaint report"

    });

  }

};


// ==========================================
// Hub Report
// ==========================================

const getHubReport = async (req, res) => {

  try {

    const result =
      await reportService.getHubReport(
        req.body || {}
      );


    return res.status(200).json({

      success: true,

      message:
        "Hub report fetched successfully",

      data: result

    });

  } catch (error) {

    console.error(
      "Hub Report Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch hub report"

    });

  }

};


// ==========================================
// Customer Report
// ==========================================

const getCustomerReport = async (req, res) => {

  try {

    const result =
      await reportService.getCustomerReport(
        req.body || {}
      );


    return res.status(200).json({

      success: true,

      message:
        "Customer report fetched successfully",

      data: result

    });

  } catch (error) {

    console.error(
      "Customer Report Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch customer report"

    });

  }

};


// ==========================================
// Revenue Report
// ==========================================

const getRevenueReport = async (req, res) => {

  try {

    const result =
      await reportService.getRevenueReport(
        req.body || {}
      );


    return res.status(200).json({

      success: true,

      message:
        "Revenue report fetched successfully",

      data: result

    });

  } catch (error) {

    console.error(
      "Revenue Report Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch revenue report"

    });

  }

};


module.exports = {

  getDashboardSummary,
  getShipmentReport,
  getPaymentReport,
  getCODReport,
  getWalletReport,
  getComplaintReport,
  getHubReport,
  getCustomerReport,
  getRevenueReport

};