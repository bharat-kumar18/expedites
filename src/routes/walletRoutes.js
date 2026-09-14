const express = require("express");

const router =
  express.Router();

const walletController =
  require("../controllers/walletController");

const {
  verifyToken
} = require("../middleware/authMiddleware");


// ==========================================
// Get My Wallet
// ==========================================

router.get(
  "/",
  verifyToken,
  walletController.getWallet
);


// ==========================================
// Get Wallet Transactions
// ==========================================

router.get(
  "/transactions",
  verifyToken,
  walletController.getTransactions
);


module.exports = router;