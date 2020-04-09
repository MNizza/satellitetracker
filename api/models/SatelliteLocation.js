// Define schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SatelliteLocationSchema = new Schema({
		coordinates: [Number, Number],
		norad_id: String,
		speed: Number,
		visibility: Number,
		footprint_radius: Number
});

// Compile model from schema
module.exports = mongoose.model(
	"SatelliteLocation",
	SatelliteLocationSchema
);
