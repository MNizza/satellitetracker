const express = require("express");
const SatelliteController = express.Router();
const fs = require("fs");
const path = require("path");
const cdir = path.join(path.dirname(fs.realpathSync(__filename)), "");
const unirest = require("unirest");

SatelliteController.get("/", (req, res) => {
	res.render("index");
});

module.exports = IndexController;
