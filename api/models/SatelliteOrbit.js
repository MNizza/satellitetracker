// Define schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SatelliteOrbitSchema = new Schema({
	norad_id: String,
	coordinates: Array
});

// Compile model from schema
module.exports = mongoose.model("SatelliteOrbitModel", SatelliteOrbitSchema);
