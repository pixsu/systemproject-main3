const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
  pickupScheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'PickupSchedule', required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  paymentStatus: { type: String, default: "for payment" },
  orderStatus: { type: String, default: "for pickup" },
  datePlaced: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);