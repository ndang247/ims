const Parcel = require("../models/parcel.model");
const Inventory = require("../models/inventory.model");
const Warehouse = require("../models/warehouse.model");
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
 * @RequestQueryParams
 * `warehouse_id`: warehouse id
 * `product_id`: product id
 * @ResponseBody { parcels }
 */
const getParcels = async (req, res) => {
  try {
    const { warehouse_id, product_id } = req.query;

    if (!warehouse_id) {
      return res.status(400).json({
        status: "Error",
        message: "Warehouse ID is required",
      });
    }

    console.log("Warehouse ID:", warehouse_id);
    console.log(new mongoose.Types.ObjectId(warehouse_id));

    // Construct the aggregation pipeline
    let parcel_pipeline = [
      {
        $lookup: {
          from: "warehouses",
          let: { warehouse_id: "$warehouse" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$warehouse_id"],
                },
              },
            },
          ],
          as: "warehouse",
        },
      },
      {
        $unwind: {
          path: "$warehouse",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          // Join the Parcel with the Product collection based on the product field
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product", // Parcel with 1 product instead of array of products
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
                    { $eq: ["$ref_object", "Parcel"] },
                  ],
                },
              },
            },
          ],
          as: "rfid",
        },
      },
      {
        $unwind: {
          path: "$rfid",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          // Include fields you want in the result
          _id: 1,
          warehouse: 1,
          // shelf: 1,
          product: 1,
          status: 1,
          datetimecreated: 1,
          datetimeupdated: 1,
          rfid: "$rfid",
        },
      },
    ]);

    // Filter to a certain products if product_id is specified
    if (product_id) {
      parcel_pipeline.push({
        $match: {
          "product._id": new mongoose.Types.ObjectId(product_id),
        },
      });
    }

    let parcels = await Parcel.aggregate(parcel_pipeline);

    parcels = parcels.map((parcel) => {
      const formattedDateTimeCreated = formatDate(
        new Date(parcel.datetimecreated)
      );
      const formattedDateTimeUpdated = formatDate(
        new Date(parcel.datetimeupdated)
      );

      return {
        ...parcel,
        product: {
          ...parcel.product,
          upc_data: JSON.parse(parcel.product.upc_data),
        },
        // Convert datetime to local time
        datetimecreated: formattedDateTimeCreated,
        datetimeupdated: formattedDateTimeUpdated,
      };
    });

    res.status(200).json({
      status: "Success",
      parcels,
    });
  } catch (error) {
    errorLogger("parcel.controller", "createParcel").error({
      message: error,
    });
    res.status(500).json({ status: "Error", error: error.message });
  }
};

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());
  const time = date.toLocaleTimeString();
  return `${day}/${month}/${year}, ${time}`;
}

module.exports = {
  createParcel,
  getParcels,
};
