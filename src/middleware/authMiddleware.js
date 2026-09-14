const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required",
      });
    }

    const parts =
      authHeader.split(" ");

    if (
      parts.length !== 2 ||
      parts[0] !== "Bearer"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
    }

    const token = parts[1];

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });

  }
};


// ==========================================
// Verify JWT Token
// ==========================================

const verifyToken = (req, res, next) => {

  try {

    // ==========================================
    // 1. Get Authorization Header
    // ==========================================

    const authHeader =
      req.headers.authorization;


    if (!authHeader) {

      return res.status(401).json({
        success: false,
        message: "Authorization token is required"
      });

    }


    // ==========================================
    // 2. Check Bearer Format
    // ==========================================

    const parts =
      authHeader.split(" ");


    if (
      parts.length !== 2 ||
      parts[0] !== "Bearer"
    ) {

      return res.status(401).json({
        success: false,
        message: "Invalid authorization format"
      });

    }


    // ==========================================
    // 3. Get Token
    // ==========================================

    const token =
      parts[1];


    if (!token) {

      return res.status(401).json({
        success: false,
        message: "Token is missing"
      });

    }


    // ==========================================
    // 4. Verify Token
    // ==========================================

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );


    // ==========================================
    // 5. Attach User To Request
    // ==========================================

    req.user = decoded;


    // ==========================================
    // 6. Continue
    // ==========================================

    next();

  } catch (error) {

    console.error(
      "Authentication Error:",
      error.message
    );


    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });

  }

};


// ==========================================
// Export
// ==========================================

module.exports = {
  authMiddleware,
  verifyToken
};

 