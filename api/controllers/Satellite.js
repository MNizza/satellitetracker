const express = require("express");
const SatelliteController = express.Router();
const fs = require("fs");
const path = require("path");
const cdir = path.join(path.dirname(fs.realpathSync(__filename)), "");
const unirest = require("unirest");
const { getLatLngObj } = require("tle.js/dist/tlejs.cjs");
const SatelliteModel = require("../models/Satellite");
const NASA_API_KEY = "iGx2fnz2wAaA5w2KBsVthwkqmILO7XQteBzoEMCE";

SatelliteController.get("/", (req, res) => {
	var satCollection = [];

	SatelliteModel.find().lean().exec((err, sat) => {

		for (var i = 0; i < 1000; i++) {
			if (sat[i].OBJECT_TYPE !== 'TBD' || sat[i].OBJECT_ID !== "ERROR") {

				sat[i].CURRENT_LAT_LNG = {};
				let tleArr = [sat[i].TLE_LINE1, sat[i].TLE_LINE2];

				sat[i].CURRENT_LAT_LNG = getLatLngObj(tleArr);

				satCollection.push(sat[i]);

			}
			else {
				console.log(`Error getting Lat/Long for ${sat[i].NORAD_CAT_ID}`);
			}
		}

		res.send({ satellites: satCollection });
	});


});
module.exports = SatelliteController;
