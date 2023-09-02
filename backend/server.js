const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const { connectDB } = require("./db/connect");
const warehouseRouter = require("./routes/warehouse.routes");
const shelfRouter = require("./routes/shelf.routes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to the backend!",
  });
});

app.use("/api/v1", warehouseRouter);
app.use("/api/v1", shelfRouter);

const server = async () => {
  try {
    await connectDB();

    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
    throw new Error("Server failed to start");
  }
};

server();
