// Define schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SatelliteDetailSchema = new Schema({
	name: String,
	number: Number,
	type: String,
	country: String,
	intIdes: String,
	orbital_period: Number,
	launch_date: Date,
	links: []
});

// Compile model from schema
module.exports = mongoose.model('SatelliteDetailModel', SatelliteDetailSchema);
