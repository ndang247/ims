const express = require('express');
const bodyParser = require('body-parser');
const { ipAddress } = require('./helpers/network');

const app = express();
const PORT = 3000; // You can change this to any available port

// Parse JSON and URL-encoded bodies
app.use(bodyParser.json());

const iotRouter = require('./routes/iot.routes');
app.use('/iot', iotRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`IoT Server is running on ${ipAddress}:${PORT}`);
});