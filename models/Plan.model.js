const mongoose = require('mongoose');

const and = new mongoose.Schema({
  amount: Number,
  resultName: String,
  quantity: Number,
  currency: String,
}, { timestamps: true, strict: false })

const schema = new mongoose.Schema({
  amount: Number,
  currency: String,
  quantity: Number,
  recurrence: String,
  resultName: String,
  and: and,
}, { timestamps: true });

module.exports = mongoose.model('Plan', schema);
