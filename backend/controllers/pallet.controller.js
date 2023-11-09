const Pallet = require("../models/pallet.model");
const { errorLogger } = require("../debug/debug");

const createPallet = async (req, res) => {
  try {
    const {
      order,
      capacity,
      datetimecreated = new Date(),
      datetimeupdated = new Date(),
    } = req.body;

    const pallet = new Pallet({
      order: order ?? null,
      capacity,
      datetimecreated,
      datetimeupdated,
    });

    const newPallet = await pallet.save();
    res.status(200).json(newPallet);
  } catch (error) {
    errorLogger("pallet.controller", "createPallet").error({
      message: error,
    });
    res.status(400).json({ status: "Error", error: error.message });
  }
};

const getOnePallet = async (req, res) => {
  try {
    const { id } = req.params;
    const pallet = await Pallet.findById(id);

    if (!pallet) {
      return res
        .status(404)
        .json({ status: "Error", error: "Pallet not found" });
    }

    res.status(200).json(pallet);
  } catch (error) {
    errorLogger("pallet.controller", "getOnePallet").error({
      message: error,
    });
    res.status(400).json({ status: "Error", error: error.message });
  }
};

const getAllPallets = async (req, res) => {
  try {
    const pallets = await Pallet.find({}).populate("order");
    res.status(200).json(pallets);
  } catch (error) {
    errorLogger("pallet.controller", "getAllPallets").error({
      message: error,
    });
    res.status(400).json({ status: "Error", error: error.message });
  }
};

const updatePallet = async (req, res) => {
  try {
    const { id } = req.params;
    const { order, capacity, status, datetimeupdated = new Date() } = req.body;

    const pallet = await Pallet.findById(id);

    if (!pallet) {
      return res
        .status(404)
        .json({ status: "Error", error: "Pallet not found" });
    }

    if (status && status === "activated") {
      const activatedPallet = await Pallet.findOne({ status: "activated" });

      if (activatedPallet._id != pallet._id) {
        activatedPallet.status = "deactivated";
        await activatedPallet.save();
      }
    }

    pallet.order = order ?? pallet.order;
    pallet.capacity = capacity ?? pallet.capacity;
    pallet.status = status ?? pallet.status;
    pallet.datetimeupdated = datetimeupdated ?? pallet.datetimeupdated;

    const updatedPallet = await pallet.save();
    res.status(200).json(updatedPallet);
  } catch (error) {
    errorLogger("pallet.controller", "updatePallet").error({
      message: error,
    });
    res.status(400).json({ status: "Error", error: error.message });
  }
};

const deletePallet = async (req, res) => {
  try {
    const { id } = req.params;
    const pallet = await Pallet.findById(id);

    if (!pallet) {
      return res
        .status(404)
        .json({ status: "Error", error: "Pallet not found" });
    }

    await pallet.remove();
    res.status(200).json({ status: "Success", message: "Pallet deleted" });
  } catch (error) {
    errorLogger("pallet.controller", "deletePallet").error({
      message: error,
    });
    res.status(400).json({ status: "Error", error: error.message });
  }
};

module.exports = {
  createPallet,
  getOnePallet,
  getAllPallets,
  updatePallet,
  deletePallet,
};
