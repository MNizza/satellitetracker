const express = require("express");
const IndexController = express.Router();
const fs = require("fs");
const path = require("path");
const cdir = path.join(path.dirname(fs.realpathSync(__filename)), "");
const unirest = require("unirest");
const pageCount = 1000;
const SatelliteModel = require("../models/Satellite");
const SatelliteLocationModel = require("../models/SatelliteLocation");

// Home page route.
IndexController.get("/", (req, res) => {
	res.render("index");
});
IndexController.get("/buildSatelliteCollection/:page", (req, res) => {
	let apiReq = unirest(
		"GET",
		"https://uphere-space1.p.rapidapi.com/satellite/list"
	);

	apiReq.query({
		page: req.params.page,
	});

	apiReq.headers({
		"x-rapidapi-host": "uphere-space1.p.rapidapi.com",
		"x-rapidapi-key": "b62476d95dmsh66acaef59f43fc7p10136fjsn8cb98427ee66",
	});

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
IndexController.get("/buildSatelliteLocationCollection", async (req, res) => {
	SatelliteLocationModel.collection.drop();
	
	var i = 0;
	var satellites = await SatelliteModel.find().exec();
	//the API requires 1 second between calls, hence the interval
	var interval = setInterval(() => {
		if (i <= satellites.length) {
			IndexController.loadSatLocation(satellites[i].number);
		}
		if(i == satellites.length) console.log("All Satellites Accounted For");
		i++;
	}, 3500);

	res.json();
});
IndexController.loadSatLocation = (number) => {
	let apiReq = unirest(
		"GET",
		`https://uphere-space1.p.rapidapi.com/satellite/${number}/location`
	);

	apiReq.query({});

	apiReq.headers({
		"x-rapidapi-host": "uphere-space1.p.rapidapi.com",
		"x-rapidapi-key": "b62476d95dmsh66acaef59f43fc7p10136fjsn8cb98427ee66",
	});
	apiReq.end(function (resp) {
		if (resp.error) console.log(resp);

		if (!IndexController.isJSON(resp.raw_body)) {
			console.log(`Error, Satellite Not Found (norad_id: ${number})`);
			return;
		}
		var location = JSON.parse(resp.raw_body);
		var satXY = new SatelliteLocationModel(location);
		satXY.save((err, doc) => {
			if(err) console.log(`Error, Could Not Store Sat Location (norad_id: ${number})`)
			else console.log(`Success, New Location Stored (norad_id: ${number})`)
		 });
	});
};
IndexController.isJSON = (str) => {
	try {
		return JSON.parse(str) && !!str;
	} catch (e) {
		return false;
	}
};
module.exports = IndexController;
