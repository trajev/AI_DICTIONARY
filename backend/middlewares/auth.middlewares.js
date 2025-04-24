const jwt = require("jsonwebtoken");
const User = require("../models/User.models.js");


const authMiddleware = async (req, res, next) => {
  try{

    const token = req.headers.authorization.split(" ")[1];

    if(!token){
      return res.status(401).json({ success: false, message: "Unauthorized! Kindly Login to search" });
    }

    const decoded = jwt.verify( token, process.env.JWT_SECRET );
    const userId = decoded._id;

    const user = await User.findById(userId);

    if(!user){
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    req.user = user;

    next();

  } catch(err){
    res.status(401).json({ success: false, message: "Unauthorized", error: err.message });
  }
}

module.exports = authMiddleware;
