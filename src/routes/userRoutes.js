const express = require("express");

const {
    getUsers,
    searchUsers,
    filterUsers,
    getUser,
    updateUser,
    updateStatus,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// ========================================
// ADMIN AUTHORIZATION
// ========================================

router.use(authMiddleware, roleMiddleware("ADMIN"));


// ========================================
// GET ALL USERS
// ========================================

router.get("/", getUsers);

// ========================================
// SEARCH USERS
// ========================================

router.post("/search", searchUsers);

// ========================================
// FILTER USERS
// ========================================

router.post("/filter", filterUsers);

// ========================================
// GET SINGLE USER
// ID COMES FROM BODY
// ========================================

router.post("/get-one", getUser);


// ========================================
// UPDATE USER
// ID COMES FROM BODY
// ========================================

router.put("/update", updateUser);


// ========================================
// UPDATE USER STATUS
// ID COMES FROM BODY
// ========================================

router.patch("/status", updateStatus);


module.exports = router;