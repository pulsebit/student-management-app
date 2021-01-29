const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  amount: Number,
  currency: String,
  quantity: Number,
  recurrence: String,
  resultName: String,
}, { timestamps: true });

module.exports = mongoose.model('Plan', schema);
