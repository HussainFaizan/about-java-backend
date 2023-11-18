const jwt = require("jsonwebtoken");
module.exports = {
  checkToken: (req, res, next) => {
    let token = req.get("authorization");
    console.log("Token Is Here", token); 
    if (token) {
      // Remove Bearer from string
      token = token.slice(7);
      const jwtSecret = req.originalUrl.includes('refresh')?process.env.REFRESH_JWT_KEY :process.env.JWT_KEY
      jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
          return res.json({
            success: 0,
            message: "Invalid Token..."
          });
        } else {
          console.log("Token Verified Successfully..!")
          req.user = user;
          next();
        }
      });
    } else {
      return res.json({
        success: 0,
        message: "Access Denied! Unauthorized User"
      });
    }
  }
};
