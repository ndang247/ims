const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const { connectDB } = require("./db/connect");
const { errorLogger, requestTimeLogger } = require("./debug/debug");

const { ipAddress } = require("./helpers/network");

dotenv.config();

const app = express();
const PORT = 3000; // You can change this to any available port

// Parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(requestTimeLogger);

const iotRouter = require("./routes/iot.routes");
app.use("/iot", iotRouter);

const iotServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`IoT Server is running on ${ipAddress}:${PORT}`);
    });
  } catch (error) {
    errorLogger("index", "iotServer").error({
      message: error,
    });
    throw new Error("Server failed to start");
  }
};

iotServer();
