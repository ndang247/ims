const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const { connectDB } = require("./db/connect");
const { errorLogger } = require("./debug/debug");
const warehouseRouter = require("./routes/warehouse.routes");
const shelfRouter = require("./routes/shelf.routes");
const productRouter = require("./routes/product.routes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to the backend!",
  });
});

app.use(process.env.ENDPOINT, warehouseRouter);
app.use(process.env.ENDPOINT, shelfRouter);
app.use(process.env.ENDPOINT, productRouter);

const server = async () => {
  try {
    await connectDB();

    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    errorLogger("server", "server").error({
      message: error.message,
    });
    throw new Error("Server failed to start");
  }
};

server();
