const express = require("express");
const SatelliteController = express.Router();
const fs = require("fs");
const path = require("path");
const cdir = path.join(path.dirname(fs.realpathSync(__filename)), "");
const unirest = require("unirest");
const { getLatLngObj } = require("tle.js/dist/tlejs.cjs");
const SatelliteModel = require("../models/Satellite");
const NASA_API_KEY = "iGx2fnz2wAaA5w2KBsVthwkqmILO7XQteBzoEMCE";

SatelliteController.get("/:limit", (req, res) => {
	var satCollection = [];

	SatelliteModel.find().limit(parseInt(req.params.limit)).lean().exec((err, sat) => {
		if (err) res.json(err);
		for (var i = 0; i < sat.length; i++) {
			if (sat[i].OBJECT_TYPE !== 'TBD' || sat[i].OBJECT_ID !== "ERROR") {

				sat[i].CURRENT_LAT_LNG = {};

				let tleArr = [sat[i].TLE_LINE1, sat[i].TLE_LINE2];
				try {
					sat[i].CURRENT_LAT_LNG = getLatLngObj(tleArr);
					satCollection.push(sat[i]);

				}
				catch{
					console.log(`Error locating satellite: ${sat[i].NORAD_CAT_ID}`)
				}

			}
			else {
				console.log(`Error getting Lat/Long for ${sat[i].NORAD_CAT_ID}`);
			}
		}

		res.send({ satellites: satCollection });
	});


});
SatelliteController.get("/build/track/:NORAD_CAT_ID", (req, res) => {

})
SatelliteController.get("/by/objectType/:operand/:OBJECT_TYPE", (req, res) => {

})
SatelliteController.get("/by/objectName/:operand/:OBJECT_NAME", (req, res) => {
	switch (req.params.operand) {
		case 'like':
			break;
		case '=':
			break;
	}

})
SatelliteController.get("/by/noradID/:NORAD_CAT_ID", (req, res) => {
	SatelliteModel.find({ NORAD_CAT_ID: req.params.NORAD_CAT_ID }).lean().exec((err, sat) => {
		if (err) res.json(err);
		if (sat.OBJECT_TYPE !== 'TBD' || sat.OBJECT_ID !== "ERROR") {

			sat.CURRENT_LAT_LNG = {};
			let tleArr = [sat.TLE_LINE1, sat.TLE_LINE2];

			sat.CURRENT_LAT_LNG = getLatLngObj(tleArr);

			satCollection.push(sat);

		}
		else {
			console.log(`Error getting Lat/Long for ${sat.NORAD_CAT_ID}`);
		}


		res.send({
			satellite: sat
		})
	})
});
module.exports = SatelliteController;
