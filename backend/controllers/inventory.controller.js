const { errorLogger } = require('../debug/debug');
const Inventory = require('../models/inventory.model');
const Product = require('../models/product.model');
const jwt = require('jsonwebtoken');

const getInventory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        status: "Error",
        error: "Invalid inventory ID",
        message: "Invalid inventory ID",
      });
    }
    const inventory = await Inventory.findById(id);

    if (!inventory) {
      return res.status(400).json({
        status: "Error",
        error: "Inventory not found",
        message: "Inventory not found",
      });
    }

    return res.status(200).json({
      status: "Success",
      inventory,
    });
  } catch (error) {
    errorLogger("inventory.controller", "getInventory").error({
      message: error,
    });
    res.status(500).json({
      status: "Error",
      error: error.message,
      message: "Error when getting inventory data",
    });
  }
};

let clients = [];
/**
 * Route: /stream/inventory/:id
 * Method: GET
 *
 * Streaming Inventory Data to Client
 */
const inventoryStream = async (req, res) => {
  const { id: barcode } = req.params;

  const {token} = req.query

  console.log('Token', token);

  if (!token) {
    return res.sendStatus(401)
  }

  jwt.verify(token, process.env.JWT_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    
    res.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-store",
      "Connection": "keep-alive",
    });

    clients.push({res, barcode});

    res.flushHeaders();
    req.on('close', () => {
      console.log('Client disconnected');
      clients = clients.filter(client => client.res !== res);
    });
  });


}

setInterval(async () => {
  console.log("Do send something");
  clients.forEach(async (client) => {
    try {
      const { res, barcode } = client;
      const product = await Product.findOne({ barcode });
      const inventory = await Inventory.findOne({ product: product._id });

      res.write(`data: ${JSON.stringify(inventory)}\n\n`);
    } catch (error) {
      console.error(error);
    }
  }
  );
}, 60000) //Change to 6000 for production

module.exports = {
  getInventory,
  inventoryStream,
};
