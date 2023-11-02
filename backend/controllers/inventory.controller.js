const { errorLogger } = require("../debug/debug");
const Inventory = require("../models/inventory.model");

const getInventory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        status: "Error",
        error: "Invalid inventory ID",
        message: "Invalid inventory ID",
      });
    }
    const inventory = await Inventory.findById(id);

    if (!inventory) {
      return res.status(400).json({
        status: "Error",
        error: "Inventory not found",
        message: "Inventory not found",
      });
    }

    return res.status(200).json({
      status: "Success",
      inventory,
    });
  } catch (error) {
    errorLogger("inventory.controller", "getInventory").error({
      message: error,
    });
    res.status(500).json({
      status: "Error",
      error: error.message,
      message: "Error when getting inventory data",
    });
  }
};

module.exports = {
  getInventory,
};
