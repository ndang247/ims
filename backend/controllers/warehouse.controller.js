const Warehouse = require("../models/warehouse.model");

const createWarehouse = async (req, res) => {
  try {
    const {
      name,
      address,
      shelves = [],
      products = [],
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
      products,
      datetimecreated,
      datetimeupdated,
    });

    res.status(200).json({ status: "Success", data: warehouse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createWarehouse };
