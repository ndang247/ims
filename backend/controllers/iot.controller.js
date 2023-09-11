const { createProduct } = require("./product.controller")

const RFID = require('../models/rfid.model')
const Parcel = require('../models/parcel.model')
const Inventory = require('../models/inventory.model')
const Product = require('../models/product.model')
const Warehouse = require('../models/warehouse.model')

const { errorLogger } = require('../debug/debug')

const { fetchUPCData } = require('../services/upc')

const defaultWarehouseId = "64f672a6fce3fa0392448d51"

let latestReceivedProduct = {}
const updateInventory = async (req, res) => {

  latestReceivedProduct = {
    ...req.body,
    dateupdated: new Date().toISOString()
  }

  const { tagID, status } = latestReceivedProduct.value;

  console.log('Updating Inventory ', tagID, status);

  // Get the tag
  const tag = await RFID.findOne({ id: tagID, ref_object: "Parcel" });

  // If tag is not found
  if (!tag) {
    return res.status(404).send({ message: "Tag not found" });
  }

  // Get the parcel using ref_id from the tag object
  const parcel = await Parcel.findById(tag.ref_id);

  // Update the status of the parcel
  const previousStatus = parcel.status;
  parcel.status = status ?? "in_warehouse";
  parcel.warehouse = defaultWarehouseId;
  await parcel.save();
  console.log('Save parcel sucessfully', parcel);

  // If status is turned into out_for_delivery or archived from in_warehouse or on_shelf
  if ((previousStatus === 'in_warehouse' || previousStatus === 'on_shelf') && (status === 'out_for_delivery' || status === 'archived')) {
    // Get inventory with product_id
    const inventory = await Inventory.findOne({ product: parcel.product });

    if (!inventory) {
      return res.status(404).send({ message: "Inventory not found" });
    }

    // Deduct parcel_quantity by 1
    inventory.parcel_quantity -= 1;
    await inventory.save();
  }

  console.log('Successfully update inventory'); 

  return res.status(200).json({ received: true })
}

/**
 * 
 * 
 */
const postInboundProcess = async (req, res) => {
  let { sensor, role, value } = req.body;
  let { tagID, barcode } = value;

  console.log('Perform post inbound: ', req.body);

  latestReceivedProduct = {
    ...req.body,
    dateupdated: new Date().toISOString()
  }

  // Check if the tag exists
  const existingTag = await RFID.findOne({ id: tagID });

  if (existingTag) {
    return updateInventory(req, res);
    // return res.status(200).send({ message: "Tag already exists" });
  }

  if (!barcode) {
    barcode = "93519441" // FIX: TEMPORARY
    // return res.status(400).send({ message: "Barcode is required" });
  }

  let product = await Product.findOne({ barcode: barcode });

  if (!product) {
    console.log('Creating product. No product found with barcode: ', barcode);
    // Get product from UPC database
    const upcData = await fetchUPCData(barcode)
    if (upcData.code.toLowerCase() !== "ok" && upcData.total !== 0) {
      return res.status(400).send({ message: "Invalid barcode" });
    }
    const upcItemData = upcData.items[0];
    console.log(`Get barcode ${barcode} from UPC database: `, upcItemData);

    // If product doesn't exist, create a new Product and Inventory
    product = new Product({
      barcode: barcode,
      upc_data: JSON.stringify(upcItemData), 
      datetimecreated: new Date(),
      datetimeupdated: new Date()
    });

    const inventory = new Inventory({
      product: product._id,
      parcel_quantity: 0,
      datetimecreated: new Date(),
      datetimeupdated: new Date()
    });

    try {
      await Promise.all([
        product.save(),
        inventory.save()
      ])
    } catch (error) {
      console.log('Error when creating new product', error);
      errorLogger("iot.controller", "postInboundProcess").error({
        message: error,
      });
      return res.status(500).send({ message: "Error when creating new product" });
    }
  }

  // Create a new Parcel
  console.log('Create a new parcel');
  const parcel = new Parcel({
    product: product._id,
    warehouse: defaultWarehouseId,
    status: "in_warehouse",  
    datetimecreated: new Date(),
    datetimeupdated: new Date()
  });

  // Create a new Tag
  console.log(`Create a new tag`, tagID);
  const tag = new RFID({
    id: tagID,
    ref_id: parcel._id,
    ref_object: "Parcel",
    tag_data: "",  
    status: "activate",  
    datetimecreated: new Date(),
    datetimeupdated: new Date()
  });

  // Add parcel to a warehouse
  console.log('Add parcel to a warehouse', defaultWarehouseId);
  const updateWarehouseParcels = Warehouse.findByIdAndUpdate(
    defaultWarehouseId,
    {
      $push: {
        parcels: parcel._id,
      },
    },
    { new: true, useFindAndModify: false }
  );

  // Add parcel to a product
  console.log('Add parcel to product',  product._id);
  const updateProductParcels = Product.findByIdAndUpdate(
    product._id,
    {
      $push: {
        parcels: parcel._id,
      },
    },
    { new: true, useFindAndModify: false }
  );

  try {
    await Promise.all([
      parcel.save(), 
      tag.save(), 
      updateWarehouseParcels,
      updateProductParcels
    ])
  } catch (error) {
    console.log('Error when saving parcel and tag', error);
    errorLogger("iot.controller", "postInboundProcess").error({
      message: error,
    });
    return res.status(500).send({ message: "Error when saving parcel and tag" });
  }

  // Get the inventory for the product and increment parcel_quantity by 1
  const inventory = await Inventory.findOne({ product: product._id });
  inventory.parcel_quantity += 1;
  await inventory.save();

  console.log('Sucessfully process inbound data from IoT: ', latestReceivedProduct);
  console.log('Parcel with Product: ', product.barcode);

  res.send({ message: "Data processed successfully" });
}

const getIoTHome = (req, res) => {
  res.sendFile(__dirname + '/iot.html');
}

const getInboundStream = async (req, res) => {
  console.log('Data stream running', latestReceivedProduct);
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const sendUpdate = () => {
      res.write(`data: ${JSON.stringify(latestReceivedProduct)}\n\n`);
  };

  const intervalId = setInterval(sendUpdate, 3000); // Send updates every 3 seconds

  req.on('close', () => {
      clearInterval(intervalId);
  });
}

module.exports = {
  updateInventory,
  postInboundProcess,
  getInboundStream,
  getIoTHome
}