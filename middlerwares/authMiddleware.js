const jwt = require("jsonwebtoken");
const User = require("../models/Owners");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    console.log("No token found in request headers");
    return res.status(401).json({message: "No token, authorization denied"});
  }

  try {
    // Log the token to verify its content
    console.log("Token received:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded) {
      const user = await User.findById(decoded?.id);
      console.log("User found:", user);
    } else {
      console.log("User not found in database");
      return res.status(401).json({message: "User not found"});
    }

    next();
  } catch (error) {
    console.error("Error in auth middleware:", error); // Detailed error logging
    res.status(401).json({message: "Token is not valid"});
  }
};

module.exports = {authMiddleware};
