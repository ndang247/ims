const mongoose = require('mongoose');

const Parcel = require("../models/parcel.model");
const Inventory = require("../models/inventory.model");
const Warehouse = require("../models/warehouse.model");
const Shelf = require("../models/shelf.model");
const Product = require("../models/product.model");
const RFID = require("../models/rfid.model");

function generateValidUPC() {
  // Generate 11 random digits
  let base = Math.floor(Math.random() * 1e11).toString().padStart(11, '0');

  // Calculate the 12th checksum digit
  let evenSum = 0;
  let oddSum = 0;
  for (let i = 0; i < base.length; i++) {
      if (i % 2 === 0) {
          oddSum += parseInt(base[i]);
      } else {
          evenSum += parseInt(base[i]);
      }
  }
  const totalSum = oddSum * 3 + evenSum;
  const mod = totalSum % 10;
  const checksum = (mod === 0) ? 0 : 10 - mod;

  // Append the checksum digit to the original 11 digits to get a valid UPC-A barcode
  return base + checksum;
}

// const DEFAULT_WAREHOUSE_ID = process.env.DEFAULT_WAREHOUSE_ID;
const DEFAULT_WAREHOUSE_ID = '650041c789d9fbf5b33516ca'

async function addData() {
  console.log('Add parcels', DEFAULT_WAREHOUSE_ID);
  const NO_PRODUCTS =  2;
  const NO_PARCELS = 2;
    try {
        for (let i = 0; i < NO_PRODUCTS; i++) {
            // Create and save product
            const product = new Product({
                barcode: generateValidUPC(),
                upc_data: JSON.stringify({ data: `upc_data_${i}` }),
                datetimecreated: new Date(),
                datetimeupdated: new Date()
            });
            await product.save();

            // Create and save inventory for the product
            const inventory = new Inventory({
                product: product._id,
                parcel_quantity: NO_PARCELS,
                datetimecreated: new Date(),
                datetimeupdated: new Date()
            });
            await inventory.save();

 
            for (let j = 0; j < NO_PARCELS; j++) {
                const parcel = new Parcel({
                    warehouse: DEFAULT_WAREHOUSE_ID,
                    product: product._id,
                    status: 'in_warehouse', // Replace with actual status
                    datetimecreated: new Date(),
                    datetimeupdated: new Date()
                });
                await parcel.save();

                // Create and save RFID for the parcel
                const rfid = new RFID({
                    id: `rfid_${i}_${j}`,
                    ref_id: parcel._id,
                    ref_object: 'Parcel',
                    tag_data: `tag_data_${i}_${j}`, // Sample data
                    status: 'active', // Replace with actual status
                    datetimecreated: new Date(),
                    datetimeupdated: new Date()
                });
                await rfid.save();
            }
        }
    } catch (error) {
        console.error('Error:', error);
        throw error
    }
}

/**
 * Generate parcels for testing
 * Each parcel has a product and an RFID
 * Each product has one inventory
 */
const generateParcels = async (req, res) => {
  try {
    await addData()
    res.status(200).send('Data added successfully')
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: "Error", error: error.message });
  }
}

/**
 * Remove all except warehouse and shelves
 * Remove all parcels with RFID, products with inventory
 */
const removeAll = async (req, res) => {
  try {
    await Promise.all([
      Parcel.deleteMany({}),
      Inventory.deleteMany({}),
      Product.deleteMany({}),
      RFID.deleteMany({}),
    ])
    res.status(200).send('All Parcels with RFID, Products with Inventory have been removed successfully')
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: "Error", error: error.message });
  }
}

const removeAllParcelsForAProduct = async (req, res) => {
  try {
    const { id:product_id } = req.params;
    if (!product_id) {
      return res.status(400).send({ message: "Product ID is required" });
    }
    const parcels = await Parcel.find({ product: product_id });

    for (let parcel of parcels) {
      await RFID.deleteMany({ ref_id: parcel._id, ref_object: 'Parcel' });
    }

    await Parcel.deleteMany({ product: product_id });

    const inventory = await Inventory.findOne({ product: product_id });
    inventory.parcel_quantity = 0;
    inventory.save()

    res.status(200).send('All Parcels with RFID have been removed successfully. Inventory has been updated to 0')
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: "Error", error: error.message });
  }
}

const generateParcelsToProducts = async (req, res) => {
  const { id: product_id } = req.params

  const { no_parcels } = req.body

  if (!product_id) {
    res.status(400).send({ message: "Product ID is required" });
  }

  let NO_PARCELS = no_parcels ?? 5


  for (let j = 0; j < NO_PARCELS; j++) {
    const parcel = new Parcel({
        warehouse: DEFAULT_WAREHOUSE_ID,
        product: product_id,
        status: 'in_warehouse', // Replace with actual status
        datetimecreated: new Date(),
        datetimeupdated: new Date()
    });
    await parcel.save();

    // Create and save RFID for the parcel
    const rfid = new RFID({
        id: `rfid_${i}_${j}`,
        ref_id: parcel._id,
        ref_object: 'Parcel',
        tag_data: `tag_data_${i}_${j}`, // Sample data
        status: 'active', // Replace with actual status
        datetimecreated: new Date(),
        datetimeupdated: new Date()
    });
    await rfid.save();
}
}

module.exports = {
  generateParcels,
  removeAll,
  removeAllParcelsForAProduct,
  generateParcelsToProducts
}