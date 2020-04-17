// Define schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SatelliteSchema = new Schema({
	ORDINAL: Number,
	ORIGINATOR:  String,
	NORAD_CAT_ID: Number,
	OBJECT_NAME: String,
	OBJECT_TYPE: String,
	CLASSIFICATION_TYPE: String,
	INTLDES: String,
	EPOCH: Date,
	EPOCH_MICROSECONDS: Number,
	MEAN_MOTION: Number,
	ECCENTRICITY: Number,
	INCLINATION: Number,
	RA_OF_ASC_NODE: Number,
	ARG_OF_PERICENTER: Number,
	MEAN_ANOMALY: Number,
	EPHEMERIS_TYPE: Number,
	ELEMENT_SET_NO: Number,
	REV_AT_EPOCH: Number,
	BSTAR: Number,
	MEAN_MOTION_DOT: Number,
	MEAN_MOTION_DDOT: Number,
	FILE: Number,
	TLE_LINE0: String,
	TLE_LINE1: String,
	TLE_LINE2: String,
	OBJECT_ID: String,
	OBJECT_NUMBER: Number,
	SEMIMAJOR_AXIS: Number,
	PERIOD: Number,
	APOGEE: Number,
	PERIGEE: Number,
	DECAYED: Number
});

// Compile model from schema
module.exports = mongoose.model('SatelliteModel', SatelliteSchema);
