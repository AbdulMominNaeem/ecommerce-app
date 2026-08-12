const jwt = require("jsonwebtoken");

const admin = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Access denied",
      });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      if (decoded.role !== "admin") {
        return res.status(403).json({
          message: "Admin access only",
        });
      }
  
      next();
    } catch (err) {
      console.log(err)
      res.status(401).json({
        message: "Invalid token",
      });
    }
};

module.exports = admin;