const express = require("express");
const http = require("http");
const Browser = require("zombie");
const SatelliteController = express.Router();
const { getLatLngObj } = require("tle.js/dist/tlejs.cjs");
const SatelliteModel = require("../models/Satellite");


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

                } catch (error) {
                    console.log(`Error locating satellite: ${sat[i].NORAD_CAT_ID}`)
                }

            } else {
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
SatelliteController.get("/:operand/:OBJECT_NAME/:limit", (req, res) => {
    var satCollection = [];

    switch (req.params.operand) {
        case 'like':
            SatelliteModel.find({ OBJECT_NAME: { $regex: req.params.OBJECT_NAME, $options: 'i' } }).limit(parseInt(req.params.limit)).lean().exec((err, sat) => {
                if (err) res.json(err);
                for (var i = 0; i < sat.length; i++) {
                    if (sat[i].OBJECT_TYPE !== 'TBD' || sat[i].OBJECT_ID !== "ERROR") {

                        sat[i].CURRENT_LAT_LNG = {};

                        let tleArr = [sat[i].TLE_LINE1, sat[i].TLE_LINE2];

                        try {
                            sat[i].CURRENT_LAT_LNG = getLatLngObj(tleArr);
                            satCollection.push(sat[i]);

                        } catch (error) {
                            console.log(`Error locating satellite: ${sat[i].NORAD_CAT_ID}`)
                        }

                    } else {
                        console.log(`Error getting Lat/Long for ${sat[i].NORAD_CAT_ID}`);
                    }
                }

                res.send({ satellites: satCollection });
            });
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

        } else {
            console.log(`Error getting Lat/Long for ${sat.NORAD_CAT_ID}`);
        }


        res.send({
            satellite: sat
        })
    })
});
SatelliteController.get("/tle-data/rebuild", (req, res) => {
    const browser = new Browser();
    browser.
    browser.visit('http://space-track.org/auth/login');
    console.log(browser.body)
    res.send();
    //console.log(browser.assert.success().fill('identity', 'marcusanizza@gmail.com').fill('password', "red87skins#1").pressButton("LOGIN"));
    // console.log(browser.visit("/basicspacedata/query/class/tle_latest/ORDINAL/1/EPOCH/>now-30/orderby/NORAD_CAT_ID/format/json"));

    // let httpOpts = {
    //     host: "www.space-track.org",
    //     path: "/basicspacedata/query/class/tle_latest/ORDINAL/1/EPOCH/>now-30/orderby/NORAD_CAT_ID/format/json",
    //     headers: { 'User-Agent': 'Mozilla/5.0' }
    // }

    // updateTLE = response => {
    //     response.on('data', function (chunk) {
    //         console.log(chunk);
    //       });

    //     //the whole response has been received, so we just print it out here
    //     response.on('end', function (data) {
    //         console.log(data);
    //         res.send();
    //     });
    // }

    // let request = http.request(httpOpts, updateTLE);
    // console.log(request)

})
module.exports = SatelliteController;