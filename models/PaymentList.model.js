const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  dueDate: Date,
  datePaid: Date,
}, { timestamps: true, strict: false });

module.exports = mongoose.model('PaymentList', schema);
