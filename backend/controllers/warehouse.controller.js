const Warehouse = require("../models/warehouse.model");
const { errorLogger } = require("../debug/debug");

const getWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find().populate({
      path: "shelves",
      // populate: {
      //   path: "products",
      //   model: "Product",
      // },
    });
    // .populate({
    //   path: "products",
    //   model: "Product",
    // });

    res.status(200).json({ status: "Success", data: warehouses });
  } catch (error) {
    errorLogger("warehouse.controller", "getWarehouses").error({
      message: error.message,
    });
    res.status(500).json({ status: "Error", error: error.message });
  }
};

const createWarehouse = async (req, res) => {
  try {
    const {
      name,
      address,
      shelves,
      parcels,
      datetimecreated = new Date(),
      datetimeupdated = new Date(),
    } = req.body;

    const warehouseExist = await Warehouse.findOne({ address });

    if (warehouseExist)
      return res
        .status(201)
        .json({ message: "Warehouse already exists", data: warehouseExist });

    const warehouse = await Warehouse.create({
      name,
      address,
      shelves,
      parcels,
      datetimecreated,
      datetimeupdated,
    });

    res.status(200).json({ status: "Success", data: warehouse });
  } catch (error) {
    errorLogger("warehouse.controller", "createWarehouse").error({
      message: error.message,
    });
    res.status(500).json({ status: "Error", error: error.message });
  }
};

module.exports = { getWarehouses, createWarehouse };
