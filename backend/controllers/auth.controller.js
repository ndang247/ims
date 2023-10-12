const User = require('../models/user.model')
const Warehouse = require('../models/warehouse.model')
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Convert incoming password to Base64
    const base64Password = Buffer.from(password).toString('base64');

    if (user.password === base64Password) {
      const token = jwt.sign({ username: user.username, role: user.role, warehouses: user.warehouses }, process.env.JWT_KEY);

      const resUser = {
        username: user.username,
        role: user.role,
        warehouses: user.warehouses
      }

      return res.status(200).json({ message: 'Login successful', user: resUser, token: token });
    } else {
      return res.status(401).json({ error: 'Invalid Credentials' });
    }

  } catch (error) {
    res.status(400).json({ error: 'Failed to login' });
  }
}

const signup = async (req, res) => {
  try {
    const { username, password, role, warehouses } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate warehouse    
    if (!Array.isArray(warehouses)) {
      return res.status(400).json({ error: 'Invalid warehouses' });
    }

    const validWarehouses = await Warehouse.find({
      '_id': { $in: warehouses }
    });

    if (validWarehouses.length !== warehouses.length) {
      return res.status(400).json({ message: 'Invalid warehouse IDs' });
    }

    // Convert password to Base64
    const base64Password = Buffer.from(password).toString('base64');

    // Create new user
    const newUser = new User({
      username,
      password: base64Password,
      role: role,
      warehouses: warehouses
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Failed to create user' });
  } 
}


module.exports = {
  login,
  signup
}
