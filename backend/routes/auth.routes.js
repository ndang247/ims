const express = require("express");

const router = express.Router();

const {
  login,
  signup
} = require("../controllers/auth.controller");

router.post("/login", login);

/**
 * @route POST /signup
 * @bodyparam username, password, role
 */
router.post("/signup", signup);


module.exports = router;