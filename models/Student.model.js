const mongoose = require('mongoose')

const paymentPlans = new mongoose.Schema({
  paymentPlanId: String,
  depositAmount: Number,
  currency: String,
  depositPaidDate: Date,
  paymentDateStart: Date,
  paymentMethod: String,
  status: String,
}, { timestamps: true, strict: false })

const paymentSchema = new mongoose.Schema({
  depositAmount: Number,
  currency: String,
  depositPaidDate: Date,
  paymentDateStart: Date,
  paymentPlanId: String,
  salesGuy: String,
  paymentMethod: String,
  contractSigned: String,
  joinedDate: Date,
}, { timestamps: true, strict: false })

const schema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  country: String,
  pipeline: String,
  photoUrl: String,
  paymentInfo: paymentSchema,
  paymentStatus: String,
  paymentPlans: [paymentPlans],
}, { timestamps: true, strict: false })

schema.index({ firstName: 'text', lastName: 'text', email: 'text', 'paymentInfo.salesGuy': 'text' })

module.exports = mongoose.model('Student', schema)

