const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { errorLogger } = require("../debug/debug");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username });

    if (!user) {
      return res
        .status(404)
        .json({ status: "Not Found", error: "User not found" });
    }

    if (user.status === "pending") {
      return res.status(401).json({
        status: "Not Found",
        error: "User is pending approval. Please contact admin.",
      });
    }

    if (user.status === "rejected") {
      return res.status(401).json({
        status: "Not Found",
        error: "User is rejected. Please contact admin.",
      });
    }

    // Convert incoming password to Base64
    const base64Password = Buffer.from(password).toString("base64");

    if (user.password === base64Password) {
      const token = jwt.sign(
        {
          _id: user._id,
          fullname: user.fullname,
          username: user.username,
          role: user.role,
        },
        process.env.JWT_KEY
      );

      const resUser = {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        role: user.role,
      };

      return res.status(200).json({
        status: "Success",
        message: "Login successful",
        user: resUser,
        token: token,
      });
    } else {
      return res
        .status(401)
        .json({ status: "Not Found", error: "Invalid Credentials" });
    }
  } catch (error) {
    errorLogger("auth.controller", "login").error({
      message: error,
    });
    res.status(500).json({
      status: "Error",
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

const signup = async (req, res) => {
  try {
    const { fullname, username, password, role, abn, address, phone, email } =
      req.body;

    if (!username || !password || !role) {
      return res
        .status(400)
        .json({ status: "Not Found", error: "Missing required fields" });
    }

    // Convert password to Base64
    const base64Password = Buffer.from(password).toString("base64");

    // Create new user
    const newUser = new User({
      fullname: fullname ?? username,
      username,
      password: base64Password,
      role: role,
      status: role === "manager" ? "accepted" : "pending",
      abn: abn,
      address: address,
      phone: phone,
      email: email,
      datetimecreated: new Date(),
      datetimeupdated: new Date(),
    });

    await newUser.save();

    const token = jwt.sign(
      {
        _id: newUser._id,
        fullname: newUser.fullname,
        username: newUser.username,
        role: newUser.role,
      },
      process.env.JWT_KEY
    );

    res.status(201).json({
      status: "Success",
      message: "User created successfully",
      user: newUser,
      token: token,
    });
  } catch (error) {
    errorLogger("auth.controller", "login").error({
      message: error,
    });
    res.status(500).json({
      status: "Error",
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

const authenticateManagerMiddleware = (req, res, next) => {
  console.log("Authenticate manager", req.user);
  const user = req.user; // Assuming req.user is populated by your auth middleware
  if (user && user.role === "manager") {
    next();
  } else {
    res.status(403).json({
      status: "Forbidden",
      message: "Forbidden: You do not have permission to perform this action.",
    });
  }
};

const addUser = async (req, res) => {
  console.log("Add user", req.body);
  const {
    username,
    password,
    role,
    status,
    abn,
    address,
    phone,
    email,
    warehouses,
  } = req.body;

  let warehousesData = warehouses;

  // Validation
  if (!username || !password || !role) {
    return res.status(400).json({
      status: "Not Found",
      message: "All fields are required",
    });
  }

  if (typeof warehouses === "string") {
    warehousesData = [warehouses];
  }

  if (!Array.isArray(warehousesData)) {
    console.log(
      "No warehouse",
      warehouses,
      typeof warehouses,
      typeof warehouses === "string",
      typeof warehouses === "object"
    );
    return res.status(400).json({
      status: "Not Found",
      message: "Invalid warehouses",
    });
  }

  if (!["manager", "staff", "outlet", "supplier", ""].includes(role)) {
    return res.status(400).json({
      status: "Not Found",
      message: "Invalid role type",
    });
  }

  let userData = {
    fullname: fullname ?? username,
    username,
    password,
    role,
    status,
    abn,
    address,
    phone,
    email,
    warehouses: warehousesData,
  };

  try {
    const newUser = new User(userData);
    await newUser.save();
    res.status(201).json({
      status: "Success",
      newUser,
    });
  } catch (err) {
    res.status(400).json({
      status: "Error",
      error: err.message,
    });
  }
};

const updateUser = async (req, res) => {
  const { username, role, warehouses } = req.body;

  // Validation
  if (
    username === "" ||
    role === "" ||
    (warehouses && !Array.isArray(warehouses))
  ) {
    return res.status(400).json({
      status: "Not Found",
      message: "Invalid input",
    });
  }

  if (role && !["manager", "staff", "outlet", "supplier"].includes(role)) {
    return res.status(400).json({
      status: "Not Found",
      message: "Invalid role type",
    });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      status: "Success",
      updatedUser,
    });
  } catch (err) {
    res.status(400).json({
      status: "Error",
      error: err.message,
    });
  }
};

const removeUser = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({
      satus: "Not Found",
      message: "Invalid User ID",
    });
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      staus: "Success",
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(400).json({
      satus: "Error",
      error: err.message,
    });
  }
};

const verifyUser = async (req, res) => {
  // Again, validation is minimal since we're updating based on ID
  if (!req.params.id) {
    return res.status(400).json({
      satus: "Not Found",
      message: "Invalid User ID",
    });
  }

  if (req.body.status !== "accepted" || req.body.status !== "rejected") {
    return res.status(400).json({
      satus: "Not Found",
      message: "Invalid status",
    });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json({
      staus: "Success",
      user,
    });
  } catch (err) {
    res.status(400).json({
      status: "Error",
      error: err.message,
    });
  }
};

const listUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      status: "Success",
      users,
    });
  } catch (err) {
    res.status(400).json({
      status: "Error",
      error: err.message,
    });
  }
};

const getSingleUser = async (req, res) => {
  // Validate the user ID
  if (!req.params.id) {
    return res.status(400).json({
      status: "Not Found",
      message: "Invalid ID",
    });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: "Not Found",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "Success",
      user,
    });
  } catch (err) {
    res.status(400).json({
      status: "Error",
      error: err.message,
    });
  }
};

const getCurrentUser = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = {
  login,
  signup,
  authenticateManagerMiddleware,

  addUser,
  updateUser,
  removeUser,
  verifyUser,
  listUsers,
  getSingleUser,
  getCurrentUser,
};
