const User = require("../models/User.models");
const bcrypt = require("bcrypt");
const { userSchema } = require("../utils/schemas/user.schema")
const jwt = require("jsonwebtoken");


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, message: "Fetched all Users", data: users });

  } catch (err) {
    res.status(500).json({ success: false, message: "Error occurred while fetching users", error: err.message });
  }
}


const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("user getting: ", req.body);

    const { error } = userSchema.validate({ username, password });
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const userExists = await User.findOne({ username: username })
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // const user = { username, password: hashedPassword };
    const user = await User.create({ username, password: hashedPassword });

    res.status(201).json({ success: true, message: "User registered successfully", data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error occurred while registering user", error: err.message });
  }
}


const loginUser = async (req, res) => {
  try {

    const { username, password } = req.body;

    const { error } = userSchema.validate({ username, password });
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const userExists = await User.findOne({ username: username })
    if (!userExists) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userExists.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: "Password didn't match" });
    }

    const jwtToken = jwt.sign({ _id: userExists._id, username: username }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({ success: true, message: "User logged in successfully", data: userExists, token: jwtToken });


  } catch (err) {
    console.log("Error occurred during login:", err);
    res.status(500).json({ success: false, message: "Error occurred while logging in", error: err.message });
  }

}



module.exports = { getAllUsers, registerUser, loginUser };