const mongoose = require('mongoose');

const PrayerSchema = new mongoose.Schema({
   name: {
        type: String,
        required: true
   },
   time: {
        type: String,
        required: true
   }
});

const Prayer = mongoose.model('Prayer', PrayerSchema);

module.exports = Prayer;