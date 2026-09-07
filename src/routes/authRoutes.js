const express = require("express");

const {
  register,
  login
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// Login is public
router.post("/login", login);


// Register/Create User - ADMIN ONLY
router.post(
  "/register",
  authMiddleware,
  roleMiddleware("ADMIN"),
  register
);


module.exports = router;