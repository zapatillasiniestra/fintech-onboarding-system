const jwt = require("jsonwebtoken");

function adminOnly(req, res, next) {
    console.log("req.user",req.user);
  if (req.user.role !== "admin") {
    return res.status(403).json({
      error: "Forbidden"
    });
  }

  next();
}

module.exports = adminOnly;
