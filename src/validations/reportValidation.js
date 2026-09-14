const {
  SHIPMENT_STATUSES
} = require("../constants/shipmentStatus");


// ==========================================
// Common Date Validation
// ==========================================

const isValidDate = (value) => {

  if (!value) {
    return true;
  }

  const date = new Date(value);

  return !isNaN(date.getTime());

};


// ==========================================
// UUID Validation
// ==========================================

const isValidUUID = (value) => {

  if (!value || typeof value !== "string") {
    return false;
  }

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return uuidRegex.test(value);

};


// ==========================================
// Common Pagination Validation
// ==========================================

const validatePagination = (data = {}) => {

  const {
    page = 1,
    limit = 10
  } = data;


  // ==========================================
  // Page
  // ==========================================

  if (
    !Number.isInteger(Number(page)) ||
    Number(page) < 1
  ) {

    throw new Error(
      "Page must be a positive integer"
    );

  }


  // ==========================================
  // Limit
  // ==========================================

  if (
    !Number.isInteger(Number(limit)) ||
    Number(limit) < 1 ||
    Number(limit) > 100
  ) {

    throw new Error(
      "Limit must be between 1 and 100"
    );

  }

};


// ==========================================
// Common Report Filter Validation
// ==========================================

const validateReportFilters = (data = {}) => {

  const {
    start_date,
    end_date
  } = data;


  // ==========================================
  // Start Date
  // ==========================================

  if (!isValidDate(start_date)) {

    throw new Error(
      "Invalid start_date"
    );

  }


  // ==========================================
  // End Date
  // ==========================================

  if (!isValidDate(end_date)) {

    throw new Error(
      "Invalid end_date"
    );

  }


  // ==========================================
  // Date Range
  // ==========================================

  if (
    start_date &&
    end_date &&
    new Date(start_date) > new Date(end_date)
  ) {

    throw new Error(
      "start_date cannot be greater than end_date"
    );

  }

};


// ==========================================
// Dashboard Validation
// ==========================================

const validateDashboard = (req, res, next) => {

  try {

    const data = req.body || {};

    validateReportFilters(data);

    next();

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

};


// ==========================================
// Shipment Report Validation
// ==========================================

const validateShipmentReport = (req, res, next) => {

  try {

    const data = req.body || {};


    // ==========================================
    // Pagination
    // ==========================================

    validatePagination(data);


    // ==========================================
    // Date Filters
    // ==========================================

    validateReportFilters(data);


    const {
      status,
      customer_id,
      search
    } = data;


    // ==========================================
    // Shipment Status
    // ==========================================

    if (status) {

      if (!SHIPMENT_STATUSES.includes(status)) {

        throw new Error(
          `Invalid shipment status. Allowed values: ${SHIPMENT_STATUSES.join(", ")}`
        );

      }

    }


    // ==========================================
    // Customer ID
    // ==========================================

    if (customer_id) {

      if (!isValidUUID(customer_id)) {

        throw new Error(
          "Invalid customer_id"
        );

      }

    }


    // ==========================================
    // Search
    // ==========================================

    if (
      search !== undefined &&
      typeof search !== "string"
    ) {

      throw new Error(
        "Search must be a string"
      );

    }


    // ==========================================
    // Search Length
    // ==========================================

    if (
      typeof search === "string" &&
      search.length > 100
    ) {

      throw new Error(
        "Search cannot exceed 100 characters"
      );

    }


    next();

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

};


// ==========================================
// Payment Report Validation
// ==========================================

const validatePaymentReport = (req, res, next) => {

  try {

    const data = req.body || {};

    validatePagination(data);

    validateReportFilters(data);


    const {
      status,
      payment_type,
      payment_method
    } = data;


    // ==========================================
    // Payment Status
    // ==========================================

    const allowedStatuses = [
      "PENDING",
      "SUCCESS",
      "FAILED",
      "REFUNDED"
    ];


    if (
      status &&
      !allowedStatuses.includes(status)
    ) {

      throw new Error(
        "Invalid payment status"
      );

    }


    // ==========================================
    // Payment Type
    // ==========================================

    const allowedPaymentTypes = [
      "WALLET_RECHARGE",
      "SHIPMENT_PAYMENT",
      "REFUND",
      "COD"
    ];


    if (
      payment_type &&
      !allowedPaymentTypes.includes(payment_type)
    ) {

      throw new Error(
        "Invalid payment type"
      );

    }


    // ==========================================
    // Payment Method
    // ==========================================

    const allowedPaymentMethods = [
      "UPI",
      "CARD",
      "NET_BANKING",
      "WALLET",
      "CASH"
    ];


    if (
      payment_method &&
      !allowedPaymentMethods.includes(payment_method)
    ) {

      throw new Error(
        "Invalid payment method"
      );

    }


    next();

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

};


// ==========================================
// COD Report Validation
// ==========================================

const validateCODReport = (req, res, next) => {

  try {

    const data = req.body || {};

    validatePagination(data);

    validateReportFilters(data);


    const {
      collection_status,
      settlement_status
    } = data;


    // ==========================================
    // Collection Status
    // ==========================================

    const allowedCollectionStatuses = [
      "PENDING",
      "COLLECTED",
      "RECONCILED"
    ];


    if (
      collection_status &&
      !allowedCollectionStatuses.includes(
        collection_status
      )
    ) {

      throw new Error(
        "Invalid COD collection status"
      );

    }


    // ==========================================
    // Settlement Status
    // ==========================================

    const allowedSettlementStatuses = [
      "NOT_ELIGIBLE",
      "ELIGIBLE",
      "SETTLED"
    ];


    if (
      settlement_status &&
      !allowedSettlementStatuses.includes(
        settlement_status
      )
    ) {

      throw new Error(
        "Invalid COD settlement status"
      );

    }


    next();

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

};


// ==========================================
// Wallet Report Validation
// ==========================================

const validateWalletReport = (req, res, next) => {

  try {

    const data = req.body || {};

    validatePagination(data);

    validateReportFilters(data);

    next();

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

};


// ==========================================
// Complaint Report Validation
// ==========================================

const validateComplaintReport = (req, res, next) => {

  try {

    const data = req.body || {};

    validatePagination(data);

    validateReportFilters(data);


    const {
      status,
      category,
      priority
    } = data;


    // ==========================================
    // Complaint Status
    // ==========================================

    const allowedStatuses = [
      "OPEN",
      "ASSIGNED",
      "IN_PROGRESS",
      "WAITING_FOR_CUSTOMER",
      "RESOLVED",
      "CLOSED",
      "REOPENED",
      "REJECTED"
    ];


    if (
      status &&
      !allowedStatuses.includes(status)
    ) {

      throw new Error(
        "Invalid complaint status"
      );

    }


    // ==========================================
    // Complaint Priority
    // ==========================================

    const allowedPriorities = [
      "LOW",
      "MEDIUM",
      "HIGH",
      "URGENT"
    ];


    if (
      priority &&
      !allowedPriorities.includes(priority)
    ) {

      throw new Error(
        "Invalid complaint priority"
      );

    }


    // ==========================================
    // Complaint Category
    // ==========================================

    const allowedCategories = [
      "DELIVERY_DELAY",
      "DAMAGED_PARCEL",
      "LOST_PARCEL",
      "WRONG_ITEM",
      "PAYMENT",
      "REFUND",
      "COD",
      "PICKUP",
      "AGENT_BEHAVIOR",
      "OTHER"
    ];


    if (
      category &&
      !allowedCategories.includes(category)
    ) {

      throw new Error(
        "Invalid complaint category"
      );

    }


    next();

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

};


// ==========================================
// Hub Report Validation
// ==========================================

const validateHubReport = (req, res, next) => {

  try {

    const data = req.body || {};

    validatePagination(data);

    next();

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

};


// ==========================================
// Customer Report Validation
// ==========================================

const validateCustomerReport = (req, res, next) => {

  try {

    const data = req.body || {};

    validatePagination(data);

    next();

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

};


// ==========================================
// Revenue Report Validation
// ==========================================

const validateRevenueReport = (req, res, next) => {

  try {

    const data = req.body || {};

    validateReportFilters(data);

    next();

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

};


// ==========================================
// Export
// ==========================================

module.exports = {

  validateDashboard,

  validateShipmentReport,

  validatePaymentReport,

  validateCODReport,

  validateWalletReport,

  validateComplaintReport,

  validateHubReport,

  validateCustomerReport,

  validateRevenueReport

};