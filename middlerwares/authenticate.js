const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.status(401).json({message: "Token is missing"});

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Token verification error:", err); // Log the error for debugging
      return res.status(403).json({message: "Token is not valid"});
    }

    req.user = user; // Attach user to request object
    next();
  });
};

module.exports = authenticateToken;
