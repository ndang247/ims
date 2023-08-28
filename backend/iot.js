const express = require('express');
const iotRouter = express.Router();

let receivedJson = {}

// Respond to GET requests from ESP8266
iotRouter.get('/esp8266', (req, res) => {
    console.log('Received GET request from ESP8266');
    // You can perform any required processing here
    // Respond with JSON data
    res.json({ message: 'Hello from Node.js!' });
});

// Receive POST requests from ESP8266
iotRouter.post('/esp8266', (req, res) => {
    console.log('Received POST request from ESP8266');
    console.log('Received data:', req.body);
    receivedJson = {
      ...req.body,
      dateupdated: new Date().toISOString()
    }
    // You can process the data and send a response back if needed
    res.json({ received: true });
});

// Serve HTML page with SSE
iotRouter.get('/', (req, res) => {
  res.sendFile(__dirname + '/iot.html');
});

// SSE endpoint to stream data updates
iotRouter.get('/data-stream', (req, res) => {
  console.log('Data stream running', receivedJson);
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const sendUpdate = () => {
      res.write(`data: ${JSON.stringify(receivedJson)}\n\n`);
  };

  const intervalId = setInterval(sendUpdate, 3000); // Send updates every 5 seconds

  req.on('close', () => {
      clearInterval(intervalId);
  });
});

module.exports = iotRouter;