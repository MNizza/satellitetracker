// Define schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SatelliteSchema = new Schema({
	name: String,
	number: Number,
	classification: String,
	launch_date: Date,
	country: String,
	type: String,
	size: String,
	orbital_period: Number,
	intIdes: String,
	selected: Boolean,
	categories: []
});

// Compile model from schema
module.exports = mongoose.model('SatelliteModel', SatelliteSchema);
