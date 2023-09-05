const { createProduct } = require("./product.controller")

const createProduct = async (req, res) => {

}


let latestReceivedProduct = {}
const updateInventory = async (req, res) => {

  latestReceivedProduct = {
    ...req.body,
    dateupdated: new Date().toISOString()
  }

  res.json({ received: true })
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