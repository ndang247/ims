const express = require("express");

const { getShelves, createShelf } = require("../controllers/shelf.controller");

const router = express.Router();

router.get("/shelves", getShelves);
router.post("/shelf/create", createShelf);

module.exports = router;
