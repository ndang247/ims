const express = require('express');
const bodyParser = require('body-parser');
const { ipAddress } = require('./network');

const app = express();
const PORT = 3000; // You can change this to any available port

// Parse JSON and URL-encoded bodies
app.use(bodyParser.json());

const iotRouter = require('./iot');
app.use('/iot', iotRouter);

app.get('/', (req, res) => {
  console.log('Received GET request from ESP8266');
  // You can perform any required processing here
  // Respond with JSON data
  res.json({ message: 'Hello from Node.js!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on ${ipAddress}:${PORT}`);
});