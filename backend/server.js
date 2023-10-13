const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const { connectDB } = require("./db/connect");
const { errorLogger } = require("./debug/debug");

const warehouseRouter = require("./routes/warehouse.routes");
const shelfRouter = require("./routes/shelf.routes");
const productRouter = require("./routes/product.routes");
const parcelRouter = require("./routes/parcel.routes");
const debugRouter = require("./routes/debug.routes");
const inboundRouter = require("./routes/inbound.routes");
const authRouter = require("./routes/auth.routes");

const { authenticateJWT } = require("./middleware/auth");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to the backend!",
  });
});

app.use(process.env.ENDPOINT, authRouter);
app.use(authenticateJWT);
app.use(process.env.ENDPOINT, warehouseRouter);
app.use(process.env.ENDPOINT, shelfRouter);
app.use(process.env.ENDPOINT, productRouter);
app.use(process.env.ENDPOINT, parcelRouter);
app.use(process.env.ENDPOINT, debugRouter);
app.use(process.env.ENDPOINT, inboundRouter);

const server = async () => {
  try {
    await connectDB();

    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    errorLogger("server", "server").error({
      message: error,
    });
  }
};

server();
