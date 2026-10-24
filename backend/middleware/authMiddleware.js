

// Used to verify the user's token and attach their information to the request.

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Used to protect routes that require authentication

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Access denied. Please log in."
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("tokenVersion");

    if (!user) {
      return res.status(401).json({
        message: "Invalid or expired token."
      });
    }

    if ((decoded.tokenVersion || 0) !== (user.tokenVersion || 0)) {
      return res.status(401).json({
        message: "Session expired. Please log in again."
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token."
    });
  }
};

module.exports = authMiddleware;
