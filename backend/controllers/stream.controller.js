const Inventory = require("../models/inventory.model");
const Product = require("../models/product.model");
const Pallet = require("../models/pallet.model");
const Parcel = require("../models/parcel.model");
const jwt = require("jsonwebtoken");

let dashboardClients = [];

// IF DEV CHANGE TO 50000 for not continuing fetching data from database
const STREAM_TIME_INTERVAL = 5000;

/**
 * Route: /stream/dashboard
 */
const dashboardStream = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;

    res.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-store",
      Connection: "keep-alive",
    });

    dashboardClients.push({ res });

    res.flushHeaders();
    req.on("close", () => {
      console.log("Client disconnected");
      dashboardClients = dashboardClients.filter(
        (client) => client.res !== res
      );
    });
  });
};

// 5 seconds
setInterval(async () => {
  console.log("Stream Dashboard");
  dashboardClients.forEach(async (client) => {
    try {
      const { res } = client;

      data = {};
      data.totalProducts = await Inventory.countDocuments();

      const totalInventory = await Inventory.aggregate([
        {
          $group: {
            _id: null, // Grouping by null means to consider all documents as a single group
            totalParcelQuantity: { $sum: "$parcel_quantity" },
          },
        },
      ]);

      if (totalInventory.length > 0) {
        console.log(
          "Total Parcel Quantity:",
          totalInventory[0].totalParcelQuantity
        );
        data.totalInventory = totalInventory[0].totalParcelQuantity;
      } else {
        data.totalInventory = 0;
      }

      const topFiveInventory = await Inventory.find()
        .sort({ datetimeupdated: -1 }) // Sort in descending order by datetimeupdated
        .limit(5) // Limit to the top 5 records
        .populate("product") // Populate the product field
        .exec();

      data.lastUpdatedInventories = topFiveInventory;

      const lowInventory = await Inventory.find({ parcel_quantity: { $lt: 5 } })
        .sort({ parcel_quantity: 1 })
        .populate("product") // Populate the product field with the actual product object
        .exec();

      data.lowInventories = lowInventory;

      /**
       * totalInventory: number
       * totalProducts: number
       * lastUpdatedInventories: array of Inventory objects
       * lowInventories: array of Inventory objects
       */
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (error) {
      console.error(error);
    }
  });
}, STREAM_TIME_INTERVAL);

let inventoryStreamClients = [];
/**
 * Route: /stream/inventory/:id
 * Method: GET
 *
 * Streaming Inventory Data to Client
 */
const inventoryStream = async (req, res) => {
  const { id: barcode } = req.params;

  const { token } = req.query;

  console.log("Token", token);

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;

    res.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-store",
      Connection: "keep-alive",
    });

    inventoryStreamClients.push({ res, barcode });

    res.flushHeaders();
    req.on("close", () => {
      console.log("Client disconnected");
      inventoryStreamClients = inventoryStreamClients.filter(
        (client) => client.res !== res
      );
    });
  });
};

setInterval(async () => {
  console.log("Do send something");
  inventoryStreamClients.forEach(async (client) => {
    try {
      const { res, barcode } = client;
      const product = await Product.findOne({ barcode });
      const inventory = await Inventory.findOne({ product: product._id });

      res.write(`data: ${JSON.stringify(inventory)}\n\n`);
    } catch (error) {
      console.error(error);
    }
  });
}, STREAM_TIME_INTERVAL);

let outboundStreamClients = [];

/**
 *  Route: /stream/outbound
 *  Method: GET
 */
const outboundStream = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;

    res.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-store",
      Connection: "keep-alive",
    });

    outboundStreamClients.push({ res });

    res.flushHeaders();
    req.on("close", () => {
      console.log("Client disconnected");
      outboundStreamClients = outboundStreamClients.filter(
        (client) => client.res !== res
      );
    });
  });
};

setInterval(async () => {
  outboundStreamClients.forEach(async (client) => {
    try {
      const { res } = client;

      let data = {};

      const activatedPallet = await Pallet.findOne({ status: "activated" });

      data.pallet = activatedPallet ?? null;

      const palletParcels = await Parcel.find({ pallet: activatedPallet.id });

      data.parcels = palletParcels ?? [];

      /**
       * pallet: Pallet object
       * parcels: array of Parcel object
       */
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (error) {
      console.error(error);
    }
  });
}, STREAM_TIME_INTERVAL);

module.exports = {
  dashboardStream,
  inventoryStream,
  outboundStream,
};
