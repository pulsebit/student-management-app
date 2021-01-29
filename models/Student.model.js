const mongoose = require('mongoose')

const notesSchema = new mongoose.Schema({
  note: String
}, { timestamps: true, strict: false })

const breakdownSchema = new mongoose.Schema({
  status: String,
  dueDate: Date,
}, { timestamps: true, strict: false })

const paymentSchema = new mongoose.Schema({
  depositAmount: Number,
  currency: String,
  depositPaidDate: Date,
  paymentDateStart: Date,
  paymentPlanId: String,
  paymentStatus: String,
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
  photoUrl: String,
  paymentInfo: paymentSchema,
  notes: [notesSchema],
  paymentBreakdown: [breakdownSchema],
}, { timestamps: true, strict: false })

module.exports = mongoose.model('Student', schema)
