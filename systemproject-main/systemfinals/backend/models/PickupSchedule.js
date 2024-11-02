const mongoose = require('mongoose');

const pickupScheduleSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  slots: {
    type: Number,
    required: true,
    min: 0 // Slots should not be negative
  }
});

const PickupSchedule = mongoose.model('PickupSchedule', pickupScheduleSchema);
module.exports = PickupSchedule;