const RFID = require("../models/rfid.model");
const Parcel = require("../models/parcel.model");
const Inventory = require("../models/inventory.model");
const Product = require("../models/product.model");
const Inbound = require("../models/inbound.model");
const Pallet = require("../models/pallet.model");

const { errorLogger } = require("../debug/debug");
const { fetchUPCData } = require("../services/upc");

const DEFAULT_WAREHOUSE_ID = "650041c789d9fbf5b33516ca";

let latestReceivedProduct = {};

const updateInventory = async (req, res) => {
  latestReceivedProduct = {
    ...req.body,
    dateupdated: new Date().toISOString(),
  };

  const { tagID, status } = latestReceivedProduct.value;

  console.log("Updating inventory:", tagID, status);

  // Get the tag
  const tag = await RFID.findOne({ id: tagID, ref_object: "Parcel" });

  // If tag is not found
  if (!tag) {
    return res
      .status(404)
      .json({ status: "Not Found", error: "Tag not found" });
  }

  // Get the parcel using ref_id from the tag object
  const parcel = await Parcel.findById(tag.ref_id);

  // Update the status of the parcel
  const previousStatus = parcel.status;
  parcel.status = status ?? "in_warehouse";
  parcel.warehouse = DEFAULT_WAREHOUSE_ID;
  await parcel.save();
  console.log("Save parcel sucessfully:", parcel);

  const inventory = await Inventory.findOne({ product: parcel.product });

  if (!inventory) {
    return res
      .status(404)
      .json({ status: "Not Found", message: "Inventory not found" });
  }
  // If status is turned into out_for_delivery or archived
  if (
    (previousStatus === "in_warehouse" || previousStatus === "on_shelf") &&
    (status === "out_for_delivery" || status === "archived")
  ) {
    // Deduct parcel_quantity by 1
    inventory.parcel_quantity -= 1;
    await inventory.save();
  } else if (previousStatus === "out_for_delivery" && !status) {
    inventory.parcel_quantity += 1;
    parcel.pallet = null;
    await inventory.save();
  }

  console.log("Successfully update inventory");

  return res.status(200).json({ status: "Success", received: true });
};

/**
 *
 *
 */
const postInboundProcess = async (req, res) => {
  let { sensor, role, value } = req.body;
  let { tagID } = value;

  console.log("Perform post inbound:", req.body);

  latestReceivedProduct = {
    ...req.body,
    dateupdated: new Date().toISOString(),
  };

  // Check if the tag exists
  const existingTag = await RFID.findOne({ id: tagID });

  if (existingTag) {
    return updateInventory(req, res);
  }

  // Barcode Check
  const inbound = await Inbound.findOne({
    warehouse: DEFAULT_WAREHOUSE_ID,
  });

  if (!inbound) {
    return res
      .status(400)
      .json({ status: "Not Found", error: "No inbound process found" });
  }

  const barcode = inbound.barcode_input;

  if (!barcode) {
    return res
      .status(400)
      .json({ status: "Not Found", error: "Barcode inbound is required" });
  }

  let product = await Product.findOne({ barcode: barcode });

  if (!product) {
    try {
      console.log("Creating product. No product found with barcode:", barcode);
      // Get product from UPC database
      const upcData = await fetchUPCData(barcode);
      if (upcData.code.toLowerCase() !== "ok" && upcData.total !== 0) {
        return res
          .status(400)
          .json({ status: "Not Found", error: "Invalid barcode" });
      }
      const upcItemData = upcData;
      console.log(`Get barcode ${barcode} from UPC database:`, upcItemData);

      // If product doesn't exist, create a new Product and Inventory
      product = new Product({
        barcode: barcode,
        upc_data: JSON.stringify(upcItemData),
        datetimecreated: new Date(),
        datetimeupdated: new Date(),
      });

      const inventory = new Inventory({
        product: product._id,
        parcel_quantity: 0,
        datetimecreated: new Date(),
        datetimeupdated: new Date(),
      });

      await Promise.all([product.save(), inventory.save()]);
    } catch (error) {
      console.log("Error when creating new product:", error);
      errorLogger("iot.controller", "postInboundProcess").error({
        message: error,
      });
      return res
        .status(500)
        .json({ status: "Error", error: "Error when creating new product" });
    }
  }

  // Create a new Parcel
  console.log("Create a new parcel");
  const parcel = new Parcel({
    product: product._id,
    warehouse: DEFAULT_WAREHOUSE_ID,
    status: "in_warehouse",
    datetimecreated: new Date(),
    datetimeupdated: new Date(),
  });

  // Create a new Tag
  console.log(`Create a new tag:`, tagID);
  const tag = new RFID({
    id: tagID,
    ref_id: parcel._id,
    ref_object: "Parcel",
    tag_data: "",
    status: "activated",
    datetimecreated: new Date(),
    datetimeupdated: new Date(),
  });
  try {
    await Promise.all([parcel.save(), tag.save()]);

    // Get the inventory for the product and increment parcel_quantity by 1
    const inventory = await Inventory.findOne({ product: product._id });
    inventory.parcel_quantity += 1;
    await inventory.save();

    console.log(
      "Sucessfully process inbound data from IoT:",
      latestReceivedProduct
    );
    console.log("Parcel with Product:", product.barcode);

    res
      .status(200)
      .json({ status: "Success", message: "Data processed successfully" });
  } catch (error) {
    console.log("Error when processing inbound data:", error);
    errorLogger("iot.controller", "postInboundProcess").error({
      message: error,
    });
    return res
      .status(500)
      .json({ status: "Error", error: "Error when processing inbound data" });
  }
};

const getIoTHome = (req, res) => {
  res.jsonFile(__dirname + "/iot.html");
};

const getInboundStream = async (req, res) => {
  console.log("Data stream running:", latestReceivedProduct);
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const jsonUpdate = () => {
    res.write(`data: ${JSON.stringify(latestReceivedProduct)}\n\n`);
  };

  const intervalId = setInterval(jsonUpdate, 3000); // json updates every 3 seconds

  req.on("close", () => {
    clearInterval(intervalId);
  });
};

const postOutboundProcess = async (req, res) => {
  let { sensor, role, value } = req.body;
  let { tagID } = value;

  console.log("Perform post outbound", req.body);
  try {
    const existingTag = await RFID.findOne({ id: tagID });

    if (!existingTag) {
      return res
        .status(404)
        .json({ status: "Not Found", error: "Tag not found" });
    }

    if (existingTag.ref_object !== "Parcel") {
      return res
        .status(404)
        .json({ status: "Error", error: "Tag is not a parcel" });
    }

    const currentParcel = await Parcel.findById(existingTag.ref_id);

    if (!currentParcel) {
      return res
        .status(404)
        .json({ status: "Not Found", error: "Parcel not found" });
    }

    const activatedPallet = await Pallet.findOne({ status: "activated" });

    if (!activatedPallet) {
      return res
        .status(404)
        .json({ status: "Not Found", error: "No activated pallet found" });
    }

    // Update parcel pallet
    currentParcel.pallet = activatedPallet._id;
    currentParcel.status = "loaded_on_pallet";

    await currentParcel.save();

    res
      .status(200)
      .json({ status: "Success", message: "Data processed successfully" });
  } catch (error) {
    console.log("Error when processing outbound data:", error);
    errorLogger("iot.controller", "postOutboundProcess").error({
      message: error,
    });
    return res
      .status(500)
      .json({ status: "Error", error: "Error when processing outbound data" });
  }
};

module.exports = {
  updateInventory,
  postInboundProcess,
  getInboundStream,
  getIoTHome,
  postOutboundProcess,
};
