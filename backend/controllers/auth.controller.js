const User = require("../models/user.model");
const Warehouse = require("../models/warehouse.model");
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

    // Convert incoming password to Base64
    const base64Password = Buffer.from(password).toString("base64");

    if (user.password === base64Password) {
      const token = jwt.sign(
        {
          username: user.username,
          role: user.role,
          warehouses: user.warehouses,
        },
        process.env.JWT_KEY
      );

      const resUser = {
        username: user.username,
        role: user.role,
        warehouses: user.warehouses,
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
    const { username, password, role, warehouses } = req.body;

    if (!username || !password || !role) {
      return res
        .status(400)
        .json({ status: "Not Found", error: "Missing required fields" });
    }

    // Validate warehouse
    if (!Array.isArray(warehouses)) {
      return res
        .status(400)
        .json({ status: "Not Found", error: "Invalid warehouses" });
    }

    const validWarehouses = await Warehouse.find({
      _id: { $in: warehouses },
    });

    if (validWarehouses.length !== warehouses.length) {
      return res
        .status(400)
        .json({ status: "Not Found", error: "Invalid warehouse IDs" });
    }

    // Convert password to Base64
    const base64Password = Buffer.from(password).toString("base64");

    // Create new user
    const newUser = new User({
      username,
      password: base64Password,
      role: role,
      warehouses: warehouses,
    });

    await newUser.save();

    const token = jwt.sign(
      {
        username: newUser.username,
        role: newUser.role,
        warehouses: newUser.warehouses,
      },
      process.env.JWT_KEY
    );

    res.status(201).json({
      status: "Success",
      message: "User created successfully",
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

module.exports = {
  login,
  signup,
};
