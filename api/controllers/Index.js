const express = require("express");
const IndexController = express.Router();
const fs = require("fs");
const path = require("path");
const cdir = path.join(path.dirname(fs.realpathSync(__filename)), "");
const unirest = require("unirest");
const pageCount = 1000;
const SatelliteModel = require("../models/Satellite");
// Home page route.
IndexController.get("/", (req, res) => {
	res.render("index");
});
IndexController.get("/build/tle-collection", (req, res) => {
	SatelliteModel.collection.drop();

	let apiReq = unirest(
		"GET",
		"https://www.space-track.org/basicspacedata/query/class/tle_latest/ORDINAL/1/EPOCH/%3Enow-30/orderby/NORAD_CAT_ID/format/json"
	);

	apiReq.end(function (resp) {
		if (resp.error) throw new Error(resp.error);

		var arr = JSON.parse(resp.raw_body);
		arr.forEach((satellite) => {
			var sat = new SatelliteModel(satellite);
			sat.save((err, doc) => {
				if (err) res.json(err);
			});
		});
	});
	res.json();
});

IndexController.isJSON = (str) => {
	try {
		return JSON.parse(str) && !!str;
	} catch (e) {
		return false;
	}
};
module.exports = IndexController;
