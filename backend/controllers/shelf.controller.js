const Shelf = require("../models/shelf.model");
const Warehouse = require("../models/warehouse.model");

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
    res.status(500).json({ status: "Error", error: error.message });
  }
};

const createShelf = async (req, res) => {
  try {
    const {
      number,
      location_in_warehouse,
      aisle,
      products,
      datetimecreated = new Date(),
      datetimeupdated = new Date(),
      // warehouse info
      _id,
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
    res.status(500).json({ status: "Error", error: error.message });
  }
};

module.exports = { getShelves, createShelf };
