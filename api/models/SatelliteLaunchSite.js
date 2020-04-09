// Define schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SatelliteSiteSchema = new Schema({
	site: {
		id: String,
		abbreviation: String,
		name: String,
		description: String,
		latitude: Number,
		longitude: Number
	}
});

// Compile model from schema
module.exports = mongoose.model('SatelliteSiteModel', SatelliteSiteSchema);
