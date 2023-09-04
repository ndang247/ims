const Shelf = require("../models/shelf.model");
const Warehouse = require("../models/warehouse.model");
const { errorLogger } = require("../debug/debug");

const getShelves = async (req, res) => {
  try {
    const shelves = await Shelf.find().populate({
      path: "warehouse",
      model: "Warehouse",
    });
    //   .populate({
    //     path: "products",
    //     model: "Product",
    //   });

    res.status(200).json({ status: "Success", data: shelves });
  } catch (error) {
    errorLogger("shelf.controller", "getShelves").error({
      message: error.message,
    });
    res.status(500).json({ status: "Error", error: error.message });
  }
};

const createShelf = async (req, res) => {
  try {
    const {
      // warehouse info
      _id,
      // shelf info
      number,
      location_in_warehouse,
      aisle,
      products,
      datetimecreated = new Date(),
      datetimeupdated = new Date(),
    } = req.body;

    const shelfExist = await Shelf.findOne({ number });

    if (shelfExist)
      return res
        .status(201)
        .json({ message: "Shelf already exists", data: shelfExist });

    const shelf = await Shelf.create({
      warehouse: _id,
      number,
      location_in_warehouse,
      aisle,
      products,
      datetimecreated,
      datetimeupdated,
    });

    // Add shelf to warehouse
    await Warehouse.findByIdAndUpdate(
      _id,
      { $push: { shelves: shelf._id } },
      { new: true, useFindAndModify: false }
    );

    res.status(200).json({ status: "Success", data: shelf });
  } catch (error) {
    errorLogger("shelf.controller", "createShelf").error({
      message: error.message,
    });
    res.status(500).json({ status: "Error", error: error.message });
  }
};

module.exports = { getShelves, createShelf };
