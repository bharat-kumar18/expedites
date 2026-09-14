const reportModel =
  require("../models/reportModel");


// ==========================================
// Dashboard
// ==========================================

const getDashboardSummary = async (filters) => {

  return await reportModel.getDashboardSummary(
    filters
  );

};


// ==========================================
// Shipment Report
// ==========================================

const getShipmentReport = async (filters) => {

  return await reportModel.getShipmentReport(
    filters
  );

};


// ==========================================
// Payment Report
// ==========================================

const getPaymentReport = async (filters) => {

  return await reportModel.getPaymentReport(
    filters
  );

};


// ==========================================
// COD Report
// ==========================================

const getCODReport = async (filters) => {

  return await reportModel.getCODReport(
    filters
  );

};


// ==========================================
// Wallet Report
// ==========================================

const getWalletReport = async (filters) => {

  return await reportModel.getWalletReport(
    filters
  );

};


// ==========================================
// Complaint Report
// ==========================================

const getComplaintReport = async (filters) => {

  return await reportModel.getComplaintReport(
    filters
  );

};


// ==========================================
// Hub Report
// ==========================================

const getHubReport = async (filters) => {

  return await reportModel.getHubReport(
    filters
  );

};


// ==========================================
// Customer Report
// ==========================================

const getCustomerReport = async (filters) => {

  return await reportModel.getCustomerReport(
    filters
  );

};


// ==========================================
// Revenue Report
// ==========================================

const getRevenueReport = async (filters) => {

  return await reportModel.getRevenueReport(
    filters
  );

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