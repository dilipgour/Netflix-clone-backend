const jwt = require("jsonwebtoken");
require('dotenv').config()



const fetchuser = (req, res, next) => {
  const token=req.headers["auth-token"]

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
  
  
    const decoded = jwt.verify(token, process.env.JWT_SEC);
   
  
    req.user = decoded.user;
    
  } catch (err) {

    return res.status(401).json({err});
    
  }
  return next();
};

module.exports = fetchuser