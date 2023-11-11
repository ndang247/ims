const Pallet = require("../models/pallet.model");
const Parcel = require("../models/parcel.model");
const { errorLogger } = require("../debug/debug");

const createPallet = async (req, res) => {
  try {
    const {
      order,
      name,
      capacity,
      datetimecreated = new Date(),
      datetimeupdated = new Date(),
    } = req.body;

    if (!name) {
      return res.status(400).json({
        status: "Error",
        error: "Please provide a pallet name",
      });
    }

    // Check if there is already a pallet with the same name
    const palletExist = await Pallet.findOne({ name });

    if (palletExist) {
      return res.status(400).json({
        status: "Error",
        error: "There is already a pallet with that name",
      });
    }

    const pallet = new Pallet({
      order: order ?? null,
      name,
      capacity,
      datetimecreated,
      datetimeupdated,
    });

    const newPallet = await pallet.save();
    res.status(200).json({
      status: "Success",
      pallet: newPallet,
    });
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

    res.status(200).json({
      status: "Success",
      pallet,
    });
  } catch (error) {
    errorLogger("pallet.controller", "getOnePallet").error({
      message: error,
    });
    res.status(400).json({ status: "Error", error: error.message });
  }
};

/**
 * Query:
 *    order: order_id to query pallets for specific order
 */
const getAllPallets = async (req, res) => {
  try {
    let queryObj = {};
    if (req.query.order) {
      queryObj.order = req.query.order;
    }

    const pallets = await Pallet.find(queryObj).populate("order");

    const palletsWithParcelsPromises = pallets.map(async (pallet) => {
      let parcels = await Parcel.find({ pallet: pallet._id }).populate(
        "product"
      );

      if (parcels) {
        parcels = parcels.map((parcel) => {
          console.log(parcel);
          return {
            ...parcel.toObject(),
            product: {
              ...parcel.product.toObject(),
              upc_data: JSON.parse(parcel.product.upc_data),
            },
          };
        });
      }

      return { ...pallet.toObject(), parcels };
    });

    const palletsWithParcels = await Promise.all(palletsWithParcelsPromises);

    res.status(200).json({
      status: "Success",
      pallets: palletsWithParcels,
    });
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

      if (
        activatedPallet &&
        activatedPallet._id.toString() !== pallet._id.toString()
      ) {
        activatedPallet.status = "deactivated";
        await activatedPallet.save();
      }
    }

    pallet.order = order ?? pallet.order;
    pallet.capacity = capacity ?? pallet.capacity;
    pallet.status = status ?? pallet.status;
    pallet.datetimeupdated = datetimeupdated ?? pallet.datetimeupdated;

    const updatedPallet = await pallet.save();
    res.status(200).json({
      status: "Success",
      pallet: updatedPallet,
    });
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
