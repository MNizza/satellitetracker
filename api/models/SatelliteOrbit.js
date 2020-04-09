// Define schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SatelliteOrbitSchema = new Schema({
	orbit: {
		lat: Number,
		lng: mongoose.Types.Decimal128
	}
});

// Compile model from schema
module.exports = mongoose.model('SatelliteOrbitModel', SatelliteOrbitSchema);
