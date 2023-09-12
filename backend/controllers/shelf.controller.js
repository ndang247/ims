const Shelf = require("../models/shelf.model");
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

    if (shelfExist.length > 0)
      return res
        .status(201)
        .json({ message: "Shelf already exists", data: shelfExist });

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
