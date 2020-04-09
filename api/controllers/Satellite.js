const express = require("express");
const SatelliteController = express.Router();
const fs = require("fs");
const path = require("path");
const cdir = path.join(path.dirname(fs.realpathSync(__filename)), "");
const unirest = require("unirest");
const Satellite = require("../models/Satellite");
const SatelliteLocation = require("../models/SatelliteLocation");

SatelliteController.get("/", async (req, res) => {
	var satellites = await Satellite.find().exec();
	var satelliteXY = await SatelliteLocation.find().exec();
	
	res.json({satellites, satelliteXY})
});

module.exports = SatelliteController;
