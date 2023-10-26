const OutletOrder = require("../models/outlet_order.model");
const mongoose = require('mongoose');

const outletOrderController = {

  // Create new Outlet Order
  async create(req, res) {
    try {
      const user = req.user
      const { description, status, products, datetimecreated } = req.body;
      console.log('User' , user);
      const newOrder = new OutletOrder({
        user: user._id,
        description,
        status: status ?? "pending",
        products,
        datetimecreated: datetimecreated ?? new Date(),
      });

      const savedOrder = await newOrder.save();
      res.status(201).json(savedOrder);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update existing Outlet Order
  async update(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;
      const { description, status, products, datetimecreated } = req.body;

      const updatedOrder = await OutletOrder.findByIdAndUpdate(
        id,
        { user, description, status, products, datetimecreated },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get Single Outlet Order
  async getSingle(req, res) {
    try {
      const { id } = req.params;
      const order = await OutletOrder.findById(id).populate('user').populate('products.product');

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.status(200).json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getMany(req, res) {
    try {
      const orders = await OutletOrder.find()
        .populate('user')
        .populate('products.product')
        .sort({ datetimecreated: -1 });

      const transformedOrders = orders.map(order => {
        const orderObject = order.toObject();
        orderObject.products = orderObject.products.map(productItem => {
          if (typeof productItem.product.upc_data === 'string') {
            try {
              // Parse the JSON string to JSON object
              productItem.product.upc_data = JSON.parse(productItem.product.upc_data);
            } catch (err) {
              console.error("Error parsing JSON string: ", err);
            }
          }
          return productItem;
        });
        return orderObject; 
      });
  
      res.status(200).json(transformedOrders);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  

  // Delete Outlet Order
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedOrder = await OutletOrder.findByIdAndDelete(id);

      if (!deletedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = outletOrderController;
