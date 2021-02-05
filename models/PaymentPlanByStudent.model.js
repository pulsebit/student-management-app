const mongoose = require('mongoose')

const PaymentPlanByStudent = new mongoose.Schema({
  studentId: String,
  paymentPlanId: String,
  depositAmount: Number,
  currency: String,
  depositPaidDate: Date,
  paymentDateStart: Date,
  paymentMethod: String,
  status: String,
}, { timestamps: true, strict: false })

module.exports = mongoose.model('PaymentPlanByStudent', PaymentPlanByStudent)