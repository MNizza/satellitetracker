const express = require("express");
const SatelliteController = express.Router();
const fs = require("fs");
const path = require("path");
const cdir = path.join(path.dirname(fs.realpathSync(__filename)), "");
const unirest = require("unirest");
const SatelliteModel = require("../models/Satellite");
const SatelliteLocationModel = require("../models/SatelliteLocation");
const SatelliteOrbitModel = require("../models/SatelliteOrbit");

SatelliteController.get("/", async (req, res) => {
	var satellites = await SatelliteModel.find().exec();
	var satelliteXY = await SatelliteLocationModel.find().exec();
	var satelliteOrbit = await SatelliteOrbitModel.find().exec();
	
	res.json({ satellites, satelliteXY, satelliteOrbit });
});

module.exports = SatelliteController;
