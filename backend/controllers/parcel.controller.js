const Parcel = require("../models/parcel.model");
const Inventory = require("../models/inventory.model");
const Warehouse = require("../models/warehouse.model");
const Shelf = require("../models/shelf.model");
const Product = require("../models/product.model");

const mongoose = require("mongoose");

const { errorLogger } = require("../debug/debug");

const createParcel = async (req, res) => {
  try {
    const {
      warehouse,
      shelf,
      product,
      status,
      quantity, // Apply quantity limit on front-end
      datetimecreated = new Date(),
      datetimeupdated = new Date(),
    } = req.body;

    // Check if warehouse and product actually exist
    const warehouseExist = await Warehouse.findById(warehouse);
    const productExist = await Product.findById(product);

    if (warehouseExist && productExist) {
      for (let i = 0; i < quantity; i++) {
        // Create a new parcel
        const parcel = await Parcel.create({
          warehouse,
          shelf,
          product,
          status,
          datetimecreated,
          datetimeupdated,
        });
        await parcel.save();
      }

      // Update inventory parcel_quantity for the newly added parcels
      const inventory = await Inventory.findOne({ product });
      const inventoryUpdated = await Inventory.findByIdAndUpdate(
        inventory._id,
        { parcel_quantity: inventory.parcel_quantity + quantity },
        { new: true, useFindAndModify: false }
      );

      res.status(200).json({
        status: "Success",
        inventory: inventoryUpdated,
      });
    } else
      return res.status(404).json({
        status: "Not Found",
        message: "Warehouse or product not found",
      });
  } catch (error) {
    errorLogger("parcel.controller", "createParcel").error({
      message: error,
    });
    res.status(500).json({ status: "Error", error: error.message });
  }
};

/**
 * Get parcels for a warehouse
 * 
 * @RequestBody
 * `warehouse_id`: warehouse id
 * `product_id`: product id
 * @ResponseBody { parcels }
 */
const getParcels = async (req, res) => {
  try {
    const { warehouse_id, product_id } = req.body;

    if (!warehouse_id) {
      return res.status(400).send({ message: "Warehouse ID is required" });
    }

    console.log('Warehouse ID: ', warehouse_id);
    console.log(new mongoose.Types.ObjectId(warehouse_id));

    // Construct the aggregation pipeline
    let parcel_pipeline = [
      {
        $match: { // Filter the parcels by warehouse.
          warehouse: new mongoose.Types.ObjectId(warehouse_id)
        }
      },
      {
        $lookup: { // Join the Parcel with the Product collection based on the product field
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product"
        }
      },
      {
        $unwind: "$product" // Parcel with 1 product instead of array of products
      },
    ];

    // RFID added
    parcel_pipeline = parcel_pipeline.concat([
      {
        $lookup: {
          from: "rfids", // This should match the name of the RFID collection
          let: { parcel_id: "$_id" },
          pipeline: [
            {
              // Find the RFID with the same ref_id and ref_object as the Parcel
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$ref_id", "$$parcel_id"] },
                    { $eq: ["$ref_object", "Parcel"] }
                  ]
                }
              }
            }
          ],
          as: "rfid"
        }
      },
      {
        $unwind: {
          path: "$rfid",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          // Include fields you want in the result
          warehouse: 1,
          product: 1,
          rfid: "$rfid"
        }
      }
    ])

    // Filter to a certain products if product_id is specified
    if (product_id) {
      parcel_pipeline.push({
        $match: {
          "product._id": new mongoose.Types.ObjectId(product_id)
        }
      });
    }

    const parcels = await Parcel.aggregate(parcel_pipeline);

    res.send(parcels);
} catch (error) {
    console.error('Error:', error);
    errorLogger("parcel.controller", "getParcels").error({
        message: error,
    });
    res.status(500).send({ message: "Internal Server Error" });
}
};

module.exports = { 
  createParcel,
  getParcels
};
