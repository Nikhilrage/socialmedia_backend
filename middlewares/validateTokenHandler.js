const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  try {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
      if (!token) {
        res.status(400).json({ message: "token is missing!" });
      }
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          res.status(400).json({
            message: "Token validation failed. User is not authorised",
          });
        }
        req.user = decoded.user;
        next();
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

module.exports = validateToken;
