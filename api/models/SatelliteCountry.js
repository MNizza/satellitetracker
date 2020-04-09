// Define schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SatelliteCountrySchema = new Schema({
	category: {
		id: String,
		name: String,
		abbreviation: String
	}
});

// Compile model from schema
module.exports = mongoose.model('SatelliteCountryModel', SatelliteCountrySchema);
