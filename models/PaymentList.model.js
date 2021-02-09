const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  dueDate: Date,
  datePaid: Date,
  studentId: String,
  paymentPlanId: String,
}, { timestamps: true, strict: false });

module.exports = mongoose.model('PaymentList', schema);
