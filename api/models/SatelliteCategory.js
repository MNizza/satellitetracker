// Define schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SatelliteCategorySchema = new Schema({
	category: {
		id: String,
		name: String,
	}
});

// Compile model from schema
module.exports = mongoose.model('SatelliteCategory', SatelliteCategorySchema);
