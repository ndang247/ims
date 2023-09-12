const Shelf = require("../models/shelf.model");
const Warehouse = require("../models/warehouse.model");
const { errorLogger } = require("../debug/debug");

const getShelves = async (req, res) => {
  try {
    const shelves = await Shelf.find().populate({
      path: "warehouse",
      model: "Warehouse",
    });

    res.status(200).json({ status: "Success", data: shelves });
  } catch (error) {
    errorLogger("shelf.controller", "getShelves").error({
      message: error,
    });
    res.status(500).json({ status: "Error", error: error.message });
  }
};

const createShelf = async (req, res) => {
  try {
    const {
      // warehouse info
      warehouse,
      // shelf info
      number,
      location_in_warehouse,
      aisle,
      datetimecreated = new Date(),
      datetimeupdated = new Date(),
    } = req.body;

    // Need to check in a specific warehouse and at specific location
    const shelfExist = await Shelf.find({
      warehouse,
      number,
      aisle,
    });

    // Check if warehouse exists
    const warehouseExist = await Warehouse.findById(warehouse);
    if (!warehouseExist)
      return res
        .status(404)
        .json({ status: "Not found", message: "Warehouse does not exist" });

    // Check if there is already a shelf at that location in the same warehouse
    if (shelfExist.length > 0)
      return res.status(201).json({
        status: "Success",
        message: "Shelf location already occupied",
        data: shelfExist,
      });

    const shelf = await Shelf.create({
      warehouse,
      number,
      location_in_warehouse,
      aisle,
      datetimecreated,
      datetimeupdated,
    });

    res.status(200).json({ status: "Success", data: shelf });
  } catch (error) {
    errorLogger("shelf.controller", "createShelf").error({
      message: error,
    });
    res.status(500).json({ status: "Error", error: error.message });
  }
};

module.exports = { getShelves, createShelf };
