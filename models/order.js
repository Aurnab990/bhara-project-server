const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  providerEmail: { type: String, required: true },
  orderEmail: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  transactionNumber: { type: String },
  acceptedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
