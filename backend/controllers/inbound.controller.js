const Inbound = require('../models/inbound.model')
const Product = require('../models/product.model')
const Inventory = require('../models/inventory.model')

const { errorLogger } = require('../debug/debug')

const { fetchUPCData } = require('../services/upc')

let inboundBarcode = ""
const postInboundBarcode = async (req, res) => {
  let { warehouse_id, barcode } = req.body
  
  console.log('inbound process', warehouse_id, barcode);

  let product = await Product.findOne({ barcode: barcode });

  if (!product) {
    try {
      console.log('Creating product. No product found with barcode: ', barcode);
      // Get product from UPC database
      const upcData = await fetchUPCData(barcode);
      if (upcData.code.toLowerCase() !== "ok" && upcData.total !== 0) {
        return res.status(400).send({ message: "Invalid barcode" });
      }
      const upcItemData = upcData;
      console.log(`Get barcode ${barcode} from UPC database: `, upcItemData);

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

  console.log('Adding inbound process');

  let inbound = await Inbound.findOne({
    warehouse_id: warehouse_id
  })

  if (!inbound) {
    inbound = new Inbound({
      warehouse: warehouse_id,
      barcode_input: barcode,
      datetimecreated: new Date(),
      datetimeupdated: new Date(),
    })
  }

  inbound.barcode_input = barcode
  await inbound.save()

  return res.status(200).json({ updated: true });
}

const getInbound = async (req, res) => {
  let {warehouse_id} = req.query

  console.log('Get inbound process', warehouse_id);

  if (!warehouse_id) {
    return res.status(400).send({ message: "Warehouse is required" });
  }

  let inbound = await Inbound.findOne({
    warehouse: warehouse_id
  })

  if (!inbound) {
    return res.status(200).send({ data: null });
  }

  const upcData = await fetchUPCData(inbound.barcode_input);
  if (upcData.code.toLowerCase() !== "ok" && upcData.total !== 0) {
    return res.status(400).send({ message: "Invalid barcode" });
  }
  
  inbound = {
    ...inbound._doc,
    upc_data: upcData
  }

  return res.status(200).json({data: inbound})
}

module.exports = {
  postInboundBarcode,
  getInbound
}